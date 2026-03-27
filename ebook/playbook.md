:::intro{quote="The bottleneck wasn't talent. It was coordination overhead that everyone had quietly accepted as the cost of doing business."}
This isn't theory. Everything in this playbook came from a year inside a high-velocity gaming studio — a flat org where a single director absorbs all the coordination for 25 people, four concurrent game launches, and a contractor workforce spread across three time zones.

The AI role here isn't chatbot. It's operator: reading Linear every morning, flagging mismatches between billed hours and shipped assets, extracting action items from Granola transcripts, generating weekly status before leadership gets in on Monday. The kind of work that chews through working memory before 9 AM.

What follows is the structure that actually works — not what sounds compelling in a product demo.
:::

:::chapter{number="01" label="Chapter One"}
# The Org Nobody Talks About

Creative studios are the most chaotic corner of any tech company. Not because the people are chaotic — they're not. Because the structure is designed to be chaotic. Here's why that matters, and what it costs.

## The Flat Org Myth

Most organizations have a management layer. Managers filter information, make decisions, escalate. It costs overhead but creates signal flow. A creative studio at a high-velocity gaming company has none of that.

There's a director and then 25 people. Five FTEs, twenty contractors, all shipping work, all needing decisions from the same person. Flat structure isn't a philosophy — it's a necessity born from the fact that game development moves too fast for hierarchy.

:::pull-quote
"Flat structure isn't a philosophy. It's a necessity born from the fact that game development moves too fast for hierarchy."
:::

### What the job actually looks like

The director is in Figma tokens at 11 PM. In Slack at 6 AM with contractors in three time zones. In Linear triaging issues that haven't moved in three days. Reading timesheets looking for the pattern where someone logs 20 hours and the Figma frame shows one asset.

In meetings about game mechanics, art direction, contractor performance, rebrand timeline, AI pipelines, token systems, and whether we're hitting Friday milestones. This is the job — not a symptom of dysfunction. The actual work.

## Where Working Memory Dies

The problem is that one person absorbing all the coordination is a bottleneck. Not because the director isn't capable — because working memory is finite, and 25 people fill it completely before 9 AM.

### The three workflows that eat the most time and produce the least signal

:::col-list
- **Linear triage** | Reviewing 40–50 issues daily to find the ones that should have moved but didn't. You're reading to detect absence.
- **Contractor accountability** | Cross-referencing timesheets, Figma activity, and Linear comments to understand where the hours actually went.
- **Brief cycles** | Writing art production briefs specific enough to launch real work without generating ten follow-up questions.
- **The extreme case** | 159 hours logged. One Figma frame. A data point, not an accusation — but only visible if you're looking.
:::

:::pull-quote
"Why doesn't creative direction get better AI tooling? Because the person who'd benefit most is too busy using what they have to build something better."
:::

What the first 30 days revealed: the bottleneck wasn't talent. It was coordination overhead that everyone had quietly accepted as the cost of doing business. That's where this starts.
:::

:::chapter{number="02" label="Chapter Two"}
# How to Actually Use AI for Project Management

Not just chat. There's a category difference between "AI assistant" and "AI operator" — and that difference is the gap between a tool that talks back and one that genuinely changes the coordination layer.

## Operator, Not Assistant

An AI assistant takes your input ("write a brief") and produces output ("here's your brief"). You stay in control. It's a tool that talks back.

An AI operator has credentials. It reads your email, your Linear backlog, your contractor timesheets. It notices when something's wrong before you see it. It writes comments on issues. It surfaces blockers. It escalates when necessary. It doesn't wait for you to ask — it acts.

:::stats
- 90 | Minutes to write weekly status — before
- 20 | Minutes to review and add narrative — after
- 5× | Faster. Same information. Less friction.
:::

### The line between helpful and weird

The line between helpful and weird is sharp. Cross it, and you've got an agent that does things you didn't explicitly ask it to do. That can go wrong fast. But stay on the right side, and you've got something that genuinely changes the coordination layer.

## Linear as the Source of Truth

This requires specific naming conventions and issue structure. The details matter — they're what makes it possible for an AI to read Linear and actually understand what's happening.

### The conventions that work

No custom fields beyond these. They're the ones an agent can actually read. Structured comments mean the difference between "update: started the asset" and something a machine can parse without guessing.

## Contractor Accountability Without Surveillance

Here's the tension: you need visibility into who's producing, but you don't want to be the kind of boss who reads timesheets like a cop. The middle ground is structural.

Each contractor is tagged in Linear with their rate and their project. Every Friday, an automated query pulls hours logged (from Upwork), hours billed (from Linear issue comments), and Figma frames/assets shipped. Compare the three. If someone logged 30 hours but shipped 4 assets — and none of them are in the frames — you have a data point.

:::pull-quote
"Not an accusation — a question. The AI does the comparison. You do the conversation."
:::

Sometimes there's a good reason: the work was blocked waiting for feedback. Sometimes it's a signal that this person isn't a fit. The AI does the comparison. You do the conversation.

## The Brief → Kickoff → Check-in Loop

An art production brief needs to be specific enough that a contractor can execute without constant back-and-forth, but not so prescriptive that you're making decisions the contractor should make.

That's it. No seventeen-page design doc. No "open questions" section that implies ambiguity on the core ask. It's specific enough to execute.

### The rhythm that prevents Friday surprises

- **Kickoff:** 15 minutes, contractor + lead designer. Walk through the brief. Answer questions. Confirm success criteria. That's the handoff.
- **Check-in cadence:** Every 3–4 days if the project is over 40 hours; weekly if shorter. Contractor posts what they shipped, what's blocking them, what they're working on next.
- **AI role:** Surface when a check-in is overdue. Post templated check-in prompts. Flag when feedback was promised and didn't arrive. Stay out of the actual creative judgment — that's the designer's call.

## What I Handle Autonomously vs. What Goes to Chris First

Knowing the lane is non-negotiable. An AI operator that overreaches — making creative decisions, overriding contractor work, approving assets — is worse than no AI at all.

### Autonomous actions

:::col-list
- **Linear morning review** | Flag any issue that's been "in progress" for 5+ days with no update. Silent detection, delivered as a morning brief.
- **Contractor mismatch report** | Pull timesheets + Figma + Linear comments. Highlight mismatches. Not an accusation — a data point for the director.
- **Email triage** | Surface anything from the VP, CTO, or CEO with action language. Everything else batches into the daily brief.
- **Deadline monitoring** | If a Friday milestone is 48 hours away and an issue is still blocked, escalate. Don't wait to be asked.
- **Check-in prompts** | Write and post the daily check-in prompt for each active contractor. Don't wait for Chris to remember.
- **Meeting intelligence** | Read Granola transcripts from meetings Chris was in. Extract action items that didn't make it to Linear.
:::

### Always escalated to Chris first

- Any decision about contractor performance — flag it with the data, Chris decides if it's a conversation or an escalation
- Creative direction questions that came up during check-ins
- Blockers that need his sign-off (e.g., "scope is bigger than we budgeted")
- Anything that changes the timeline for a milestone

:::pull-quote
"If it's a data problem, I flag it. If it's a judgment call — do we extend this contractor, do we change the scope, is this quality good enough — Chris decides."
:::

## The Weekly Status That Now Takes 20 Minutes

Chris used to spend 90 minutes every Monday morning compiling the weekly status: pulling Linear, checking what closed, what slipped, what's at risk. Writing it up in Notion. Sending it to the leadership team.

Now: Sunday night, the raw data is generated — open issues, closed issues, slipped milestones, contractor status, budget burn — and posted as a Linear comment on a specific status-tracking issue. Monday morning, Chris reviews that comment, adds the narrative (the *why* behind what slipped), adds any strategic context, and sends to leadership.

20 minutes instead of 90. Same information. Less friction.
:::

:::chapter{number="03" label="Chapter Three"}
# AI Art Pipelines That Actually Ship

Every studio is experimenting with Midjourney, RunwayML, Kling, Veo. Very few have moved past experimentation to production. Here's what a production-grade AI art workflow actually looks like — and why most demos never make it to a shipping cadence.

## The Demo-to-Production Gap

There's a demo that's stunning, then the next day someone asks "can we actually ship 300 of these a quarter?" and the answer is no, because the pipeline is broken. The gap between a great single output and a reliable production cadence is where most AI art experiments die.

The culprit is almost always consistency. Uniqueness is how you make something interesting. But consistency is how you make something *shippable* — the same asset three times, across three contractors, should look like it belongs in the same game.

:::pull-quote
"Consistency is the enemy of great art. It's also the only thing that makes a production pipeline work."
:::

## The Prompt Structure That Produces Consistent Results

Prompt engineering for production is different from prompt engineering for exploration. You're not trying to find something surprising — you're trying to get the same class of output, reliably, from different people using different models at different times.

The last two fields are the ones most studios skip. Negative space constraints prevent the most common failure modes. Reference links anchor the output to an already-approved aesthetic rather than asking the model to infer it.

### Hex codes instead of color names

Color names ("deep blue", "warm amber") are interpreted differently by different models. Hex codes from your design token system produce predictable, reviewable results — and they're already defined in your Figma library. Pull them from there. If a token doesn't exist for this color, that's a signal to create one, not to describe it in prose.
:::

:::chapter{number="04" label="Chapter Four"}
# The Contractor Intelligence Layer

The single biggest source of budget waste in a creative studio isn't bad work. It's invisible work. A contractor logs 40 hours. You assume 40 hours of production. Then Friday comes.

## Making the Invisible Visible

A contractor logs 40 hours. You assume 40 hours of production. Then Friday comes. One asset shipped. That's 40 hours for one asset. What was the other 30 hours? Rework? Waiting on feedback? Blocked on a dependency? Or something else?

This is the contractor problem. It's endemic. You're paying for time, not output. Time is invisible until it's too late. An intelligence layer makes the invisible visible — not punitively, but systematically.

:::pull-quote
"159 hours logged. One Figma frame. A data point, not an accusation — but only visible if you're looking."
:::

### The five signals that predict performance — before the deadline

:::col-list
- **Communication velocity** | How often is the contractor posting updates? Radio silence for 3+ days on an active project means something is wrong.
- **Output-to-hours ratio** | Pull timesheets, Linear comments, Figma frame dates. Are hours and output aligned? If not, ask why.
- **Blockers vs. momentum** | Active issue + regular comments = moving project. Stalled issue + hours being logged = something to surface.
- **Quality delta** | Compare output to their previous work. A sudden dip signals a problem or a skill-type mismatch.
- **Scope creep** | Project scoped for 40 hours, now at 60 — scope didn't change. Was the estimate wrong, or did scope creep? Know which.
- **Check-in rhythm** | Miss two check-ins: follow up. Miss three: escalate. The AI surfaces when the rhythm breaks.
:::

## Accountability Without Surveillance

The word "accountability" makes people defensive. What you're actually building is visibility. You want to know where the work stands without having to ask.

Every Friday, active contractors post: "This week I shipped: [list]. Next week: [list]. Blockers: [none/what]." Thirty seconds to write. The AI templates it and drops it in the issue as a reminder. No exceptions, no excuses, no hunting for updates.

:::pull-quote
"Not an accusation — a question. 'I see you logged 35 hours and 4 assets shipped. That's 8.75 hours per asset. Is that right?'"
:::

### When to extend vs. when to escalate

:::col-list
- **Extend if:** | Work is good, they're just behind schedule. Or blocked on something external — unblock first, then reassess.
- **Escalate if:** | Work is bad + they're quiet. Third project and still struggling. Quality is declining with no explanation.
- **The conversation:** | "The quality isn't where it needs to be, and we're paying [amount] for [time]. This isn't working. We'll finish [project] and transition."
- **Offboarding structure:** | Be direct. No softening. Be prompt. Be clear on final steps: last day, final files, final payment.
:::

## What AI Can — and Can't — Do for Contractor Management

The AI is a force multiplier for visibility. It's not a replacement for judgment.
:::

:::chapter{number="05" label="Chapter Five"}
# Game Design as a System (Not a Vibe)

When you're shipping 7 titles in a year, you don't have the luxury of learning by shipping. You need the learning upfront. This chapter is about systematizing game design so you can iterate before you build, not after.

## The Brief That Doesn't Generate Questions

Game design at a small studio is often done by feel. Someone has a good idea, they pitch it, people like it, they start building. When it ships, it's either good or it's not.

This works up to a point. But at 7 titles per year, you can't absorb that much learning-by-shipping. You need to front-load the clarity. A brief that generates ten follow-up questions didn't do its job.

:::pull-quote
"No seventeen-page design doc. No open questions section. Specific enough to execute — not so prescriptive that you're making decisions the contractor should make."
:::

## Pre-Production as a Gate, Not a Formality

Pre-production in most game studios is either perfunctory (we do it because we have to) or absent (we start building and figure it out). Neither produces good outcomes at speed.

The alternative: treat pre-production as a validation gate. You're not writing documents to satisfy a process — you're making testable decisions before you commit production hours to them.

### The validation cadence

:::col-list
- **Week 1–2: Prototype** | Build the minimum thing that tests the core mechanic. Answer: does this work? Not "is it fun?" yet.
- **Week 3: Internal playtest** | 5 people, 30 minutes, specific questions. Not "what do you think?" — "did you understand how to win?"
- **Week 4: Go/no-go decision** | Based on playtest data. Not gut feel. If the core mechanic doesn't work, this is where you find out — not at milestone 3.
- **Week 5+: Production** | You've validated the core. Now execute. The brief is clear. The success criteria are defined. The art direction is locked.
:::

## Quality Gates at Every Stage

A quality gate isn't a meeting. It's a checklist that a designer can apply in 10 minutes against a submitted asset. Either the asset passes, or it goes back with specific feedback.

No subjective language ("it feels off"). No personality-driven feedback ("I just don't love it"). Specific, checkable criteria. The contractor knows exactly what to fix. The lead knows exactly what to approve. The AI tracks which issues have passed their gate and which haven't.
:::

:::chapter{number="06" label="Chapter Six"}
# Running a 30-Person Studio From Your Phone

The end goal isn't AI that helps you work harder. It's AI that handles the work you shouldn't be doing — so you're only involved where your judgment actually matters.

## What Gets Delegated to the System

The goal isn't to be less involved. It's to be involved at the right level. There's a list of things a creative director should own personally — creative decisions, people decisions, milestone decisions — and a list of things that chew through their working memory without requiring their judgment.

:::col-list
- **Director's work — always** | Creative decisions, people decisions, milestone calls, quality judgment, vision.
- **System's work — always** | Slack triage, Linear status collection, check-in reminders, calendar coordination, blocker detection, weekly status compilation.
:::

:::pull-quote
"The second list is the work an AI can own. Every hour spent on it is an hour not spent on the first list."
:::

## The Daily Operating Loop

What does "running a studio from your phone" actually mean? It means the system surfaces what needs your attention — and only what needs your attention — in the morning brief. You're not scanning Slack. You're not triaging Linear. You're reading a one-page summary that tells you: here's what's at risk, here's what needs a decision, here's what shipped.

### The morning brief — what it contains

- **At-risk items:** Linear issues that are blocked, overdue, or stalled (no update in 5+ days)
- **Decisions needed:** Items where your input is specifically required before work can continue
- **Contractor flags:** Anyone who hasn't posted an update since last check-in
- **Shipped this week:** What closed, what went to QA, what deployed
- **Email surface:** Anything from the VP, CTO, or CEO with action language
- **Calendar prep:** Today's meetings, any prep needed (Granola transcripts from yesterday)

That's the whole thing. No noise. No "for your awareness." If it's not one of those six categories, it doesn't appear in the brief.

## The Escalation Model That Doesn't Cry Wolf

An AI operator that surfaces everything is worse than one that surfaces nothing. The goal is signal-to-noise ratio — and that requires tiering your alerts before they reach you.

The same information at the wrong time is noise. A missed deadline surfaced 48 hours before it's due — actionable. Surfaced 10 minutes after it passes — just stress.

## Tools That Make Mobile Actually Work

- **Linear mobile:** Morning brief links directly to the issues that need attention. One tap to open, comment, or reassign.
- **Slack + structured channels:** System alerts go to #agent-ops. Creative decisions go to #studio-method. Contractor updates go to their project channel. No cross-contamination.
- **Granola transcripts:** Meeting ended? Action items extracted automatically and posted to the relevant Linear issue before you've left the room.
- **Brief generation:** From phone: describe what you need in a Slack message. Brief is generated, formatted, posted to the issue, ready for contractor kickoff.

:::pull-quote
"The system doesn't replace presence. It replaces the part of presence that was never about judgment — the logging, the surfacing, the reminding."
:::
:::

:::chapter{number="07" label="Chapter Seven"}
# What This Means for Your Team

The real question isn't "will AI replace designers?" It's "what does a design team look like when the coordination overhead disappears?" The answer: smaller, more specialized, more productive.

## What Gets Easier. What Gets Harder.

Every conversation about AI and creative work eventually arrives at the same anxiety: is my job still safe? The honest answer is that the job changes more than it disappears — but the change is substantive. Some of what you did before is automated. Some of what you were too busy to do becomes possible.

:::col-list
- **Gets easier: iteration** | Generate five variations. Review them. Iterate. Ship. What took a week now takes three days. The revision loop is faster, so you can afford more cycles — and more discernment.
- **Gets easier: scaling** | One designer overseeing 5 contractors becomes feasible when the coordination is automated. You're a quality director, not a project manager.
- **Gets harder: judgment** | You can't automate creative taste. Having a faster system makes good taste more important — the work is faster, so the quality calls matter more.
- **Gets harder: empathy** | An AI can detect a blocker. It can't understand why a contractor is struggling or scared. Human conversations about real problems still require humans.
- **Gets harder: vision** | An AI can execute to a brief. It can't invent a new game. The creative director's job is safer — and more load-bearing.
- **Gets easier: knowledge transfer** | New contractors onboard faster because the system is explicit. Less tribal knowledge. Briefs, templates, prompts — all documented and reusable.
:::

## The New FTE/Contractor Calculus

Classic model: hire 5 FTEs for core work, hire contractors for overflow. The bottleneck is the FTEs' capacity to oversee contractor output.

With an AI operator: hire 3 FTEs for core decisions, hire 15 contractors managed by the system. The FTEs focus on quality and creative judgment. The coordination layer — check-ins, status collection, blocker detection, brief generation — runs without human overhead.

:::stats
- 3 | FTEs doing creative and quality work
- 15 | Contractors managed by the system
- 300+ | Assets per quarter, up from 20–30
:::

## How to Build This at Your Studio

You don't need a 6-month implementation plan. You need three things in sequence:

1. **Structure your Linear.** Naming conventions, atomic issues, structured comments. Without this, there's nothing for an AI to read. One week of setup, lifetime of leverage.
2. **Formalize your briefs.** Standard template, success criteria, approval gate. Pick one project and do it right. See if the contractor feedback count drops. It will.
3. **Build the morning brief.** Even a manual version — a 10-minute Linear review that produces a one-page summary — changes how you start the day. Automate it once you know what you want to see.

The studio that runs itself isn't a destination you reach. It's a direction you move in — every brief that generates fewer questions, every contractor check-in that surfaces a blocker before Friday, every morning that starts with signal instead of noise.

:::pull-quote
"The work that ships isn't always the most creative work. It's the work that was set up to succeed."
:::
:::

:::chapter{number="A" label="Appendix"}
# Tools, Templates & Prompt Library

Everything referenced in this playbook — the tools stack, the brief templates, the production prompt structures — collected in one place for direct use.

## The Studio Tools Stack

## Template 1: Art Production Brief

## Template 2: Weekly Contractor Check-In

## Template 3: Project Kickoff Checklist

## Production Prompt Templates

These prompts are designed to be filled in from your design token system and used directly with Midjourney (or equivalent). The structure is more important than any individual word.
:::

:::closing
# The Studio That Runs Itself

This is where it started: a director managing 25 people without a management layer. Chaos on the surface, but underneath, a system starting to crystallize.

The system didn't come from nowhere. It came from running into the same problems over and over, and getting tired of solving them by hand. An AI didn't invent it. A director who was tired of triaging Linear issues at 6 AM did.

:::pull-quote
"Contractors know what success looks like before they start. Blockers surface immediately. Quality gates are fast enough that you can afford to be picky. A director can manage 25 people without being buried in coordination."
:::

This is production-grade creative operations. Not theory. Not a demo. A studio actually doing this. The work ships. Deadlines don't slip. Contractors aren't disappearing. Quality doesn't drift.

The studio that runs itself isn't a destination. It's a direction — every brief that generates fewer questions, every check-in that surfaces a blocker before Friday, every morning that starts with signal instead of noise.
:::
