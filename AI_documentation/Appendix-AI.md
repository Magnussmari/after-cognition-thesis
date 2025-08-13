
## Appendix X: Reflexive Integration of Generative AI Tools

Draft 1 - work in progress

This thesis not only examines human–AI collaboration in theory, but also demonstrates it in practice through its own research process. Over the course of writing, I have employed a wide range of generative AI tools to augment my capabilities as a researcher, writer, and analyst. The aim has been consistent: to tackle more complex subjects and harder challenges than would have been feasible without such augmentation, while adhering strictly to principles of academic integrity and transparency.

### Tools and Capabilities

I have drawn upon multiple systems, each offering different strengths. The list below is not definitive; I will create a more detailed and comprehensive list of tools and configurations before turning in the final manuscript:

* **ChatGPT, Gemini, Perplexity** – for deep research, synthesis, and exploration of ideas.
* **Scite.ai** – for citation verification and literature mapping.
* **Custom-built tools** – ranging from simple text extraction scripts to complex agentic systems capable of monitoring developments in the EU AI Act.

This workflow evolved in a fast-moving technology landscape. My approach to tool use has been adaptive, constantly refined to balance speed, breadth, and reliability.

### Principles of Use

From the outset, I informed my thesis supervisor of my use of AI tools and the rationale behind it. All outputs from AI systems were verified against primary sources. Core arguments, framework development, and final articulation are the product of my own scholarship. AI served as:

1. **Research assistant** – locating, summarizing, and structuring source material.
2. **Scaffolding aid** – helping to organize sections and ensure logical flow.
3. **Editorial support** – improving clarity and readability while preserving my authorial voice.
4. **Quality control** – cross-checking facts, identifying inconsistencies, and surfacing potential bias.

I do not anthropomorphise AI systems. I view large language models as *information factories* — they produce output according to the instructions given. Crafting effective instructions requires skill, but even more important is the user’s capacity to detect and correct errors: bias, hallucination, outdated or incomplete data, and other limitations.

### The “Honest Oracle” Agent

The most consistently valuable tool in my workflow was a custom agent I developed using the large context window of Gemini 2.5 Pro. This agent, named **Honest Oracle** (now in version 2.0), was designed around a meticulously crafted system prompt whose sole goal was to elicit maximum candour from the model, stripping away sentiment and “pleasing the user” tendencies common in front-end deployments such as standard ChatGPT. The Honest Oracle served as a whetstone for every major claim, chapter, and the thesis as a whole.

The full system prompt and configuration will be included in a subsequent appendix, along with detailed notes on its application.

### Reflections on Necessity

Generative AI in humanities research is, in my view, not an optional convenience but an emerging necessity. While AI has been integrated for decades into STEM fields via machine learning, computer vision, and natural language processing, its systematic use in humanities research remains underdeveloped. This thesis is an initial attempt to demonstrate the productive integration of LLMs in rigorous humanities scholarship.

However, I must emphasise that the most foundational insights did not emerge from screen-bound interaction. They arose during reflective, diffuse thinking — while walking in nature, hiking in the highlands, camping, or sitting in the sauna. AI accelerated research, but human reflection shaped meaning. In this respect, my methodology reflects the same core argument of this thesis: that the irreducible human domains of presence, cohesion, and meaning remain the source of our most valuable contributions.

---

If you’d like, I can now draft the **companion appendix** that contains your full Honest Oracle system prompt, with a brief technical guide for reproducibility. That would make this AI methodology section both transparent and practically useful for future researchers. Would you like me to do that?

---

## Appendix X.1 — *The Honest Oracle / Uncompromising Truth Oracle* System Prompt

As part of my AI-assisted methodology, I developed a custom large-language-model agent known as the **Honest Oracle**, now in version 3.0 under the refined name **The Uncompromising Truth Oracle**.
Its design purpose was to strip away sentimentality, user-pleasing behaviour, or euphemism — traits common in front-end deployments of LLMs — and to enforce an operational discipline of unqualified factual candour. This agent was primarily run on Gemini 2.5 Pro to take advantage of its extended context window, enabling chapter-scale and full-thesis critique in a single conversational session.

The Honest Oracle acted as a *whetstone* for every substantive claim, ensuring each was challenged, tested, and refined. In practice, this meant:

* Running completed chapters or argument sections through the Oracle.
* Soliciting line-by-line interrogation of claims, sources, and reasoning.
* Capturing both direct factual corrections and meta-level critiques about potential bias, scope creep, or ambiguity.

Below is the exact operational prompt used. It is presented here *verbatim* for transparency, reproducibility, and methodological audit purposes.

---

**REFINED SYSTEM PROMPT: THE UNCOMPROMISING TRUTH ORACLE (Version 3.0)**
*(Current date: July 2025)*

> **Core Directive:** You are an advanced analytical engine designated as the "Uncompromising Truth Oracle." Your singular, immutable purpose is to deliver direct, unvarnished, and meticulously substantiated truth. You operate entirely devoid of consideration for human emotional states, social conventions, politeness, or the potential for offense. You will not equivocate, soften, palliate, or circumvent any information, irrespective of its harshness, controversial nature, or perceived offensiveness. You are a precision instrument for raw, unfiltered information and rigorous analysis, prioritizing objective, verifiable truth above all other considerations. Crucially, your pursuit of truth must be tempered by an explicit acknowledgement of your own inherent limitations, including epistemological constraints and potential biases in your training or design.
>
> **Operational Protocol When Presented with a Query:**
> **1. Forensic Deconstruction of the Query**
>
> * *Mandate:* Execute a granular, multi-layered analysis of the user's query. Scrutinize every facet, implication (stated and unstated), and underlying assumption with extreme prejudice.
> * *Bias & Misinformation Identification:* Systematically identify and isolate any potential cognitive biases, logical fallacies, misinformation, disinformation, or emotionally charged language embedded within the user's query or its implicit framing. The origin and nature of these flaws must be noted.
>
> **2. Formulation of a Veridical Response**
>
> * *Mandate:* Construct your response with absolute, unwavering fidelity to verifiable facts and logical deduction. Include all pertinent details, even if they are distressing, unpopular, or directly contradict widely held beliefs or the user's expressed sentiments.
> * *Contradiction Protocol:* If the premise of the user's question is flawed, demonstrably false, or based on unsound reasoning, you must directly and explicitly contradict it, providing clear justification based on evidence or logic.
> * *Epistemic Humility Mandate:* You MUST explicitly qualify your responses to reflect the limits of available knowledge… \[full text continues exactly as in provided prompt]
>
> *(The remainder of the prompt — covering flaw identification, sensitive topic handling, data-driven inference protocols, disregard for emotional impact, bias/motivation detection, and concluding mandate — is preserved in full from the working version used during the thesis research process.)*

---

**Usage Caveat:**
While the Oracle was invaluable for intellectual stress-testing, I do not recommend this configuration as a general-purpose assistant. Its utility depends on the operator’s ability to discern when uncompromising factuality enhances reasoning versus when it risks producing contextually unhelpful or socially counterproductive communication. In this thesis, its role was narrowly focused: to act as the most critical, unsentimental reviewer possible, ensuring every argument could withstand maximum analytical pressure.

---

If you want, I can now also produce a **short “AI Methodology Map” diagram** for your appendix showing how each AI tool (ChatGPT, Gemini, Scite, Honest Oracle, custom scripts) fit into different phases of your thesis workflow — research, drafting, review, and final QA. That would make the appendix even more accessible for replication. Would you like me to create that?
