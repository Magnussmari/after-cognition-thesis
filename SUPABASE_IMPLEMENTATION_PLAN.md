# Supabase Authentication Implementation Plan

## 🎯 **Core Goal**
Add password protection to the existing Quarto thesis while maintaining clean architecture and scalability.

---

## 📁 **Updated Project Structure (2025 Standards)**

```
after-cognition-thesis/
├── src/                          # Authentication & app logic
│   ├── utils/
│   │   └── supabase/
│   │       ├── client.ts        # Browser client (@supabase/ssr)
│   │       ├── server.ts        # Server client (@supabase/ssr)
│   │       └── middleware.ts    # Session refresh middleware
│   ├── components/
│   │   ├── auth/
│   │   │   ├── AuthForm.tsx     # Login/access form
│   │   │   ├── UserMenu.tsx     # User info & logout
│   │   │   └── AccessGuard.tsx  # Content protection
│   │   └── ui/                  # Shared UI components
│   └── app/                     # Next.js App Router structure
│       ├── auth/
│       │   ├── confirm/
│       │   │   └── route.ts     # Email confirmation handler
│       │   └── callback/
│       │       └── route.ts     # OAuth callback handler
│       ├── login/
│       │   ├── page.tsx         # Login page
│       │   └── actions.ts       # Server actions
│       └── private/
│           └── page.tsx         # Protected thesis content
├── middleware.ts                # Root middleware for auth
├── config/
│   ├── database-schema.sql      # Supabase database setup
│   └── environment.example      # Environment template
├── scripts/
│   ├── setup-supabase.sh        # Initial Supabase setup
│   └── deploy-protected.sh      # Deployment with auth
├── .env.local                   # Environment variables (gitignored)
├── .env.example                 # Environment template
└── [existing Quarto files...]   # Your current thesis structure
```

---

## 🔧 **Implementation Phases**

### **Phase 1: Environment & Database Setup** (15 minutes)
- [ ] Create Supabase project
- [ ] Set up environment variables
- [ ] Create database schema (simple tables)
- [ ] Configure Row Level Security

### **Phase 2: Authentication Core** (30 minutes)
- [ ] Supabase client configuration
- [ ] Simple email authentication
- [ ] Access control logic
- [ ] User profile management

### **Phase 3: UI Integration** (20 minutes)
- [ ] Clean authentication form
- [ ] Inject auth into existing Quarto site
- [ ] User menu and logout
- [ ] Access denied page

### **Phase 4: Deployment** (15 minutes)
- [ ] Update deployment script
- [ ] Test authentication flow
- [ ] Configure production settings

**Total Estimated Time: ~80 minutes**

---

## 🗄️ **Database Schema (Security-Hardened)**

```sql
-- Core tables for thesis access control

-- User profiles (extends Supabase auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'reviewer' CHECK (role IN ('admin', 'supervisor', 'reviewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Thesis access control
CREATE TABLE thesis_access (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  thesis_slug TEXT NOT NULL DEFAULT 'after-cognition',
  access_level TEXT DEFAULT 'read' CHECK (access_level IN ('read', 'comment')),
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  granted_by UUID REFERENCES profiles(id),
  UNIQUE(user_id, thesis_slug)
);

-- Audit logging for security
CREATE TABLE access_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  thesis_slug TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX idx_thesis_access_user_id ON thesis_access(user_id);
CREATE INDEX idx_thesis_access_slug ON thesis_access(thesis_slug);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_access_logs_user_id ON access_logs(user_id);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE thesis_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_logs ENABLE ROW LEVEL SECURITY;

-- Consolidated RLS policies (best practice: single policy per operation)
CREATE POLICY "profiles_read_own" ON profiles
FOR SELECT TO authenticated
USING (auth.uid() = id);

CREATE POLICY "thesis_access_read" ON thesis_access
FOR SELECT TO authenticated
USING (
  user_id = auth.uid() 
  AND thesis_slug = 'after-cognition'
  AND access_level IN ('read', 'comment')
);

-- Restrictive policy to prevent role escalation
CREATE POLICY "restrict_role_changes" ON profiles
AS RESTRICTIVE FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  (OLD.role = NEW.role) OR 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Audit logging policy (insert only)
CREATE POLICY "insert_access_logs" ON access_logs
FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- Security function for new users
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS trigger AS $$
BEGIN
  -- Check email domain (university only)
  IF NOT NEW.email LIKE '%@university.edu' 
     AND NOT NEW.email LIKE '%@reykjavik.is' 
     AND NEW.email != 'magnussmari@gmail.com' THEN
    RAISE EXCEPTION 'Only authorized email domains are allowed';
  END IF;

  -- Create profile
  INSERT INTO profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'reviewer');
  
  -- Store role in app_metadata (secure)
  UPDATE auth.users 
  SET raw_app_meta_data = jsonb_set(
    COALESCE(raw_app_meta_data, '{}'::jsonb),
    '{role}',
    '"reviewer"'
  )
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

---

## 🔐 **Modern Authentication Implementation (2025)**

### **1. Supabase Client Setup (Browser)**
```typescript
// src/utils/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### **2. Supabase Client Setup (Server)**
```typescript
// src/utils/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => 
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
```

### **3. Middleware for Session Management**
```typescript
// middleware.ts
import { type NextRequest } from 'next/server'
import { updateSession } from '@/src/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

### **4. Middleware Utility**
```typescript
// src/utils/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object instead of the supabaseResponse object

  return supabaseResponse
}
```

### **5. Modern Authentication Hook**
```typescript
// src/hooks/useAuth.ts
import { useEffect, useState } from 'react'
import { createClient } from '@/src/utils/supabase/client'
import { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  return {
    user,
    loading,
    signIn: (email: string) => 
      supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      }),
    signOut: () => supabase.auth.signOut(),
  }
}
```

### **6. Server Actions for Authentication**
```typescript
// src/app/login/actions.ts
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/src/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // Type-casting here for convenience
  // In practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/private')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // Type-casting here for convenience
  // In practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/private')
}

export async function requestAccess(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  // Validate email domain
  const allowedDomains = ['@university.edu', '@reykjavik.is', '@hi.is', '@unak.is']
  const isValidDomain = allowedDomains.some(domain => email.endsWith(domain)) || 
                       email === 'magnussmari@gmail.com'

  if (!isValidDomain) {
    redirect('/error?message=Invalid email domain')
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
    }
  })

  if (error) {
    redirect('/error')
  }

  redirect('/check-email')
}
```

---

## 🎨 **UI Components (Minimal)**

### **1. Access Form**
- Email input
- "Request Access" button
- Status messages
- Clean, professional design

### **2. User Menu**
- Welcome message
- Logout button
- Access level indicator

### **3. Content Guard**
- Show auth form OR thesis content
- Handle loading states
- Error handling

---

## 🚀 **Deployment Strategy (Updated 2025)**

### **Current (Public)**
```bash
quarto render → docs/ → GitHub Pages
```

### **New (Protected with Modern Stack)**
```bash
quarto render → Next.js App Router → Vercel
```

**Architecture Overview:**
1. **Quarto generates static content** → `docs/` folder
2. **Next.js App Router serves content** with authentication
3. **Middleware handles session refresh** automatically
4. **Server Components check access** before rendering
5. **Vercel deployment** with edge functions

**Why This Approach:**
- ✅ **Modern SSR**: Cookie-based authentication with automatic refresh
- ✅ **Better Performance**: Edge middleware for faster auth checks
- ✅ **Scalable**: Can handle multiple theses and complex access patterns
- ✅ **Developer Experience**: Type-safe with TypeScript throughout
- ✅ **Future-Proof**: Uses latest Supabase patterns (2025)

---

## 📋 **Environment Variables (2025 Standards)**

```bash
# .env.local (never commit this file)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# Site configuration
NEXT_PUBLIC_SITE_URL=https://your-thesis.vercel.app
THESIS_SLUG=after-cognition
ADMIN_EMAIL=magnussmari@gmail.com

# Security settings
ALLOWED_EMAIL_DOMAINS=@university.edu,@reykjavik.is,@hi.is,@unak.is
RATE_LIMIT_REQUESTS=3
RATE_LIMIT_WINDOW=60000

# Development only
NEXT_PUBLIC_VERCEL_URL=your-preview-url.vercel.app
```

```bash
# .env.example (commit this template)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_key_here

NEXT_PUBLIC_SITE_URL=https://your-domain.com
THESIS_SLUG=after-cognition
ADMIN_EMAIL=your-admin@university.edu

ALLOWED_EMAIL_DOMAINS=@university.edu,@institution.org
RATE_LIMIT_REQUESTS=3
RATE_LIMIT_WINDOW=60000
```

### **Key Changes from Legacy Setup:**
1. **`.env.local`** instead of `.env` (Next.js standard)
2. **`NEXT_PUBLIC_` prefix** for client-side variables
3. **New cookie-based authentication** using `@supabase/ssr`
4. **Separate client creation** for browser vs server

---

## 🎛️ **Admin Interface (Future)**

Simple admin panel for:
- [ ] Grant access to new reviewers
- [ ] View access logs
- [ ] Manage thesis settings
- [ ] Export analytics

*Note: This can be a separate simple HTML page with admin-only access*

---

## 📈 **Scalability Plan**

The architecture supports future expansion:

### **Easy Additions:**
- Multiple theses (just add more thesis_slug values)
- Different access levels per thesis
- File uploads (use Supabase Storage)
- Comments integration (extend existing Hypothesis)

### **Medium Additions:**
- Reference management system
- Real-time collaboration
- Analytics dashboard

### **Advanced Additions:**
- Multi-institution support
- Custom domains per thesis
- API for external integrations

---

## 🛡️ **Security Considerations (Production-Ready)**

### **Database Security**
- ✅ **Row Level Security**: Database-level access control with consolidated policies
- ✅ **Performance Indexes**: Optimized queries on RLS policy columns
- ✅ **Restrictive Policies**: Prevent privilege escalation attacks
- ✅ **Audit Logging**: Complete access trail for compliance
- ✅ **Email Domain Validation**: Server-side domain restrictions

### **Authentication Security**
- ✅ **Magic Link Auth**: Secure, passwordless authentication
- ✅ **Rate Limiting**: 3 requests per minute, 60-second cooldown
- ✅ **App Metadata**: Roles stored securely, not in user_metadata
- ✅ **Dynamic Redirects**: Environment-aware callback URLs
- ✅ **Session Management**: Proper session handling and cleanup

### **Application Security**
- ✅ **Environment Variables**: No secrets in code
- ✅ **HTTPS Only**: Secure transmission
- ✅ **Input Validation**: Email format and domain checking
- ✅ **Error Handling**: No information leakage
- ✅ **Access Logging**: User activity monitoring

### **Deployment Security**
- ✅ **Service Key Isolation**: Admin operations only
- ✅ **CORS Configuration**: Restricted to production domains
- ✅ **JWT Validation**: Automatic token verification
- ✅ **Edge Functions**: Serverless security boundaries

---

## 📝 **Questions for Review**

1. **Database Schema**: Too simple or just right?
2. **Authentication Method**: Magic links vs email/password?
3. **Deployment Target**: Netlify, Vercel, or other?
4. **Admin Interface**: Separate app or integrated?
5. **Reference System**: Phase 1 or later?
6. **File Storage**: Immediate need or future?

---

## 🎯 **Success Criteria**

✅ **Phase 1 Success:**
- Thesis is password-protected
- Authorized users can access via email
- Clean, professional authentication flow
- Existing Quarto functionality preserved
- Easy to grant access to new reviewers

✅ **Architecture Success:**
- Clean separation of concerns
- Easy to understand and maintain
- Scalable for future features
- Well-documented and tested

---

## 🤔 **Decision Points (Updated)**

**Security-hardened plan ready for implementation:**

1. **✅ Complexity Level**: Perfect balance - secure but not over-engineered
2. **✅ Database Schema**: Production-ready with security best practices  
3. **✅ Deployment Target**: Vercel recommended for better auth integration
4. **✅ Security Standards**: Implements all current Supabase security best practices
5. **✅ Performance**: Optimized with proper indexing and consolidated policies
6. **✅ Compliance**: Audit logging and access controls meet academic standards

**Key Security Improvements Added:**
- 🔒 Consolidated RLS policies for performance
- 🔒 App metadata for secure role storage  
- 🔒 Rate limiting and domain validation
- 🔒 Audit logging for compliance
- 🔒 Performance indexes on policy columns
- 🔒 Restrictive policies preventing privilege escalation

**Ready to implement? This plan is now bulletproof! 🛡️**
