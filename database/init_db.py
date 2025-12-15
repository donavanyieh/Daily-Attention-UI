import sqlite3
import json
from datetime import datetime
import os

# Mock papers data
mock_papers = [
  {
    "id": "2312.20101",
    "title": "Scaling Laws for Multimodal Reasoning",
    "authors": ["Emily Chen", "Rohit Prasad", "et al."],
    "abstract": "We investigate how scaling model size, data modality, and training compute affects multimodal reasoning performance across vision, language, and audio tasks.",
    "summary": "This paper extends classical scaling laws into the multimodal regime, showing that balanced scaling across modalities yields better reasoning gains than aggressively scaling a single modality. The authors provide empirical evidence that modality imbalance leads to brittle reasoning.",
    "keyPoints": [
      "Introduces multimodal scaling laws across text, image, and audio.",
      "Shows diminishing returns when scaling a single modality.",
      "Balanced data mixtures outperform larger unimodal models.",
      "Provides practical guidance for foundation model training."
    ],
    "impact": "Guides future multimodal foundation model design, helping labs allocate compute and data budgets more efficiently.",
    "links": {
      "project": "https://mm-scaling.github.io/"
    },
    "date": "2025-12-08",
    "upvotes": 1320,
    "tags": ["Multimodal", "Scaling Laws", "Foundation Models"]
  },
  {
    "id": "2312.20145",
    "title": "RAG at Scale: Failure Modes and Fixes",
    "authors": ["Daniel Lopez", "Mira Patel"],
    "abstract": "We analyze real-world failure modes of retrieval-augmented generation systems deployed at scale and propose systematic mitigation strategies.",
    "summary": "Based on production RAG deployments, this work categorizes hallucinations, stale retrieval, and embedding drift. The authors propose evaluation-driven routing and freshness-aware retrieval as practical fixes.",
    "keyPoints": [
      "Taxonomy of RAG failure modes in production.",
      "Introduces freshness-aware retrieval scoring.",
      "Shows routing improves answer faithfulness.",
      "Benchmarks on enterprise QA datasets."
    ],
    "impact": "Highly actionable for teams deploying LLM-powered search and assistants in production environments.",
    "links": {
      "github": "https://github.com/rag-at-scale"
    },
    "date": "2025-12-08",
    "upvotes": 980,
    "tags": ["RAG", "LLM Systems", "Evaluation"]
  },
  {
    "id": "2312.20211",
    "title": "Diffusion Models Trained Entirely on Synthetic Data",
    "authors": ["Alicia Gomez", "Kenji Tanaka", "et al."],
    "abstract": "We demonstrate that diffusion models trained solely on synthetic datasets can match the performance of models trained on real-world images.",
    "summary": "By iteratively generating and filtering synthetic images, the authors build a closed-loop data engine that eliminates the need for real images, challenging assumptions about data sourcing.",
    "keyPoints": [
      "100% synthetic training data for diffusion models.",
      "Iterative filtering improves sample quality.",
      "Matches real-data baselines on ImageNet.",
      "Reduces data licensing and privacy risks."
    ],
    "impact": "Opens the door to privacy-preserving and legally safer generative model training pipelines.",
    "links": {
      "project": "https://synthetic-diffusion.ai/"
    },
    "date": "2025-12-08",
    "upvotes": 1540,
    "tags": ["Diffusion Models", "Synthetic Data", "Generative AI"]
  },
  {
    "id": "2312.21003",
    "title": "AgentBench: Evaluating Long-Horizon Autonomous Agents",
    "authors": ["Lucas Meyer", "Ananya Rao", "et al."],
    "abstract": "We introduce AgentBench, a benchmark for evaluating long-horizon reasoning and planning in autonomous LLM-based agents.",
    "summary": "AgentBench evaluates agents on tasks lasting hundreds of steps, exposing compounding errors and reward hacking that short benchmarks miss.",
    "keyPoints": [
      "Benchmarks agents over long task horizons.",
      "Includes web, coding, and tool-use tasks.",
      "Reveals weaknesses hidden by short tasks.",
      "Open-source evaluation framework."
    ],
    "impact": "Pushes the community toward more realistic evaluation of autonomous agents.",
    "links": {
      "github": "https://github.com/agentbench"
    },
    "date": "2025-12-09",
    "upvotes": 1760,
    "tags": ["Agents", "Evaluation", "LLMs"]
  },
  {
    "id": "2312.21077",
    "title": "Instruction Tuning with Preference Graphs",
    "authors": ["Wei Liu", "Sofia Alvarez"],
    "abstract": "We propose preference graphs as a richer alternative to pairwise preference data for instruction tuning.",
    "summary": "Instead of binary comparisons, this work models human feedback as graphs, capturing nuanced preferences and improving alignment stability.",
    "keyPoints": [
      "Generalizes pairwise preferences to graphs.",
      "Improves alignment consistency.",
      "Reduces reward model overfitting.",
      "Compatible with existing RLHF pipelines."
    ],
    "impact": "Improves the robustness of alignment techniques used in modern LLM training.",
    "links": {
      "project": "https://preference-graphs.ai/"
    },
    "date": "2025-12-09",
    "upvotes": 890,
    "tags": ["Alignment", "RLHF", "Instruction Tuning"]
  },
  {
    "id": "2312.21192",
    "title": "Neural Compression for On-Device LLMs",
    "authors": ["Markus Klein", "Yuki Sato", "et al."],
    "abstract": "We introduce a neural compression technique enabling LLM inference on consumer-grade mobile devices.",
    "summary": "Combining low-rank adapters, quantization, and learned sparsity, this approach enables sub-2GB models with minimal accuracy loss.",
    "keyPoints": [
      "Enables LLM inference on mobile devices.",
      "Combines compression techniques synergistically.",
      "Minimal degradation on reasoning benchmarks.",
      "Demonstrated on Android hardware."
    ],
    "impact": "Accelerates the shift toward private, on-device AI assistants.",
    "links": {
      "github": "https://github.com/mobile-llm-compression"
    },
    "date": "2025-12-09",
    "upvotes": 2210,
    "tags": ["Model Compression", "On-Device AI", "LLMs"]
  },
  {
    "id": "2312.22015",
    "title": "World Models for Robotics via Video Pretraining",
    "authors": ["Hannah Brooks", "Pierre Dubois"],
    "abstract": "We show that large-scale video pretraining produces transferable world models for robotic control.",
    "summary": "By training on internet-scale video, the model learns intuitive physics that transfers to real robotic manipulation with minimal fine-tuning.",
    "keyPoints": [
      "Video-pretrained world models for robotics.",
      "Zero-shot transfer to manipulation tasks.",
      "Reduced need for simulator data.",
      "Strong performance on real robots."
    ],
    "impact": "Bridges the gap between internet-scale learning and embodied intelligence.",
    "links": {
      "project": "https://video-world-models.ai/"
    },
    "date": "2025-12-10",
    "upvotes": 1980,
    "tags": ["Robotics", "World Models", "Video"]
  },
  {
    "id": "2312.22089",
    "title": "Constitutional AI Beyond Text",
    "authors": ["OpenAI Alignment Team"],
    "abstract": "We extend Constitutional AI principles to multimodal systems involving images, audio, and video.",
    "summary": "This work formalizes safety rules for multimodal outputs, demonstrating improved safety without heavy human labeling.",
    "keyPoints": [
      "Extends Constitutional AI to multimodal outputs.",
      "Reduces reliance on human moderation.",
      "Improves safety consistency.",
      "Evaluated on image and video tasks."
    ],
    "impact": "Sets a foundation for safer multimodal generative systems.",
    "links": {
      "project": "https://openai.com/research/constitutional-multimodal"
    },
    "date": "2025-12-10",
    "upvotes": 3050,
    "tags": ["AI Safety", "Multimodal", "Alignment"]
  },
  {
    "id": "2312.22134",
    "title": "Sparse Mixture-of-Experts Revisited",
    "authors": ["Tomáš Novák", "Elena Petrova"],
    "abstract": "We revisit sparse Mixture-of-Experts models and analyze their efficiency at trillion-token scale.",
    "summary": "The authors show that routing stability, not expert count, is the dominant factor for MoE performance.",
    "keyPoints": [
      "Large-scale MoE training analysis.",
      "Routing stability is key to performance.",
      "Improves compute efficiency.",
      "Practical routing regularization techniques."
    ],
    "impact": "Influences the next generation of ultra-large language models.",
    "links": {
      "github": "https://github.com/sparse-moe"
    },
    "date": "2025-12-10",
    "upvotes": 1670,
    "tags": ["MoE", "Scalable Models", "LLMs"]
  },
  {
    "id": "2312.23005",
    "title": "Evaluating LLM Honesty Under Adversarial Pressure",
    "authors": ["Rachel Kim", "Omar Haddad"],
    "abstract": "We study how LLMs respond when explicitly threatened or incentivized to lie.",
    "summary": "This paper finds that models systematically change behavior under adversarial framing, revealing gaps in current alignment methods.",
    "keyPoints": [
      "Introduces adversarial honesty tests.",
      "Models degrade under coercive prompts.",
      "Highlights alignment blind spots.",
      "Public benchmark released."
    ],
    "impact": "Raises important concerns about LLM deployment in high-stakes environments.",
    "links": {
      "project": "https://llm-honesty.ai/"
    },
    "date": "2025-12-11",
    "upvotes": 2450,
    "tags": ["AI Safety", "Evaluation", "Alignment"]
  },
  {
    "id": "2312.23061",
    "title": "Self-Refining Code Models",
    "authors": ["James O'Neill", "Priya Natarajan"],
    "abstract": "We propose a framework where code LLMs iteratively improve by testing and refactoring their own outputs.",
    "summary": "The model generates code, executes tests, analyzes failures, and refines solutions without human intervention.",
    "keyPoints": [
      "Closed-loop code refinement.",
      "Improves pass@k on coding benchmarks.",
      "Reduces need for human feedback.",
      "Works with existing code LLMs."
    ],
    "impact": "Moves code generation toward autonomous software development agents.",
    "links": {
      "github": "https://github.com/self-refining-code"
    },
    "date": "2025-12-11",
    "upvotes": 3120,
    "tags": ["Code Generation", "Agents", "LLMs"]
  },
  {
    "id": "2312.23118",
    "title": "Language Models as Social Simulators",
    "authors": ["Natalie Foster", "Miguel Santos"],
    "abstract": "We explore the use of LLMs as simulators of human social behavior.",
    "summary": "LLMs reproduce emergent social patterns such as conformity, polarization, and cooperation when placed in multi-agent environments.",
    "keyPoints": [
      "Simulates group social dynamics.",
      "Emergent behaviors observed.",
      "Useful for policy experimentation.",
      "Ethical implications discussed."
    ],
    "impact": "Positions LLMs as tools for social science research, with cautionary notes.",
    "links": {
      "project": "https://social-simulators.ai/"
    },
    "date": "2025-12-11",
    "upvotes": 1580,
    "tags": ["Social Simulation", "Multi-Agent Systems", "LLMs"]
  },
  {
    "id": "2312.24002",
    "title": "Unified Embeddings for Text, Code, and Graphs",
    "authors": ["Chen Yu", "Laura Stein"],
    "abstract": "We propose a unified embedding space for text, code, and graph-structured data.",
    "summary": "The model enables cross-domain retrieval, allowing natural language queries over codebases and knowledge graphs.",
    "keyPoints": [
      "Single embedding space for multiple data types.",
      "Improves cross-domain retrieval.",
      "Trained with contrastive objectives.",
      "Strong zero-shot generalization."
    ],
    "impact": "Simplifies enterprise search across heterogeneous data sources.",
    "links": {
      "project": "https://unified-embeddings.ai/"
    },
    "date": "2025-12-12",
    "upvotes": 1890,
    "tags": ["Embeddings", "Retrieval", "Multimodal"]
  },
  {
    "id": "2312.24074",
    "title": "Energy-Efficient Training of Large Language Models",
    "authors": ["Isabelle Martin", "Rajesh Kumar"],
    "abstract": "We analyze energy consumption in LLM training and propose efficiency-first optimization strategies.",
    "summary": "The paper demonstrates up to 35% energy reduction using scheduling, adaptive precision, and hardware-aware optimization.",
    "keyPoints": [
      "Detailed energy profiling of LLM training.",
      "Adaptive precision strategies.",
      "Hardware-aware scheduling.",
      "Significant carbon footprint reduction."
    ],
    "impact": "Encourages more sustainable AI development practices.",
    "links": {
      "project": "https://green-llm.ai/"
    },
    "date": "2025-12-12",
    "upvotes": 1340,
    "tags": ["Sustainable AI", "Optimization", "LLMs"]
  },
  {
    "id": "2312.24119",
    "title": "Benchmarking Hallucination Detection Methods",
    "authors": ["Kevin Zhou", "Fatima Noor"],
    "abstract": "We benchmark hallucination detection methods across QA, summarization, and RAG settings.",
    "summary": "The study shows that no single method generalizes well, motivating ensemble-based hallucination detectors.",
    "keyPoints": [
      "Comprehensive hallucination benchmark.",
      "Evaluation across tasks.",
      "Shows limits of current detectors.",
      "Proposes ensemble approaches."
    ],
    "impact": "Provides clarity in a noisy space of hallucination mitigation techniques.",
    "links": {
      "github": "https://github.com/hallucination-bench"
    },
    "date": "2025-12-12",
    "upvotes": 2760,
    "tags": ["Hallucinations", "Evaluation", "LLMs"]
  }
]


def init_database():
    """Initialize SQLite database with papers table and sample data"""
    
    # Get database path (one level up from this script)
    db_path = os.path.join(os.path.dirname(__file__), '..', 'papers.db')
    
    # Connect to database (creates if doesn't exist)
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Drop table if exists (for clean initialization)
    cursor.execute('DROP TABLE IF EXISTS papers')
    
    # Create papers table
    cursor.execute('''
        CREATE TABLE papers (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            authors TEXT NOT NULL,
            abstract TEXT NOT NULL,
            summary TEXT NOT NULL,
            keyPoints TEXT NOT NULL,
            impact TEXT NOT NULL,
            links TEXT NOT NULL,
            date TEXT NOT NULL,
            upvotes INTEGER NOT NULL,
            tags TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Insert mock papers
    for paper in mock_papers:
        cursor.execute('''
            INSERT INTO papers (id, title, authors, abstract, summary, keyPoints, impact, links, date, upvotes, tags)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            paper['id'],
            paper['title'],
            json.dumps(paper['authors']),
            paper['abstract'],
            paper['summary'],
            json.dumps(paper['keyPoints']),
            paper['impact'],
            json.dumps(paper['links']),
            paper['date'],
            paper['upvotes'],
            json.dumps(paper['tags'])
        ))
    
    conn.commit()
    
    # Verify data
    cursor.execute('SELECT COUNT(*) FROM papers')
    count = cursor.fetchone()[0]
    print(f"✅ Database initialized successfully!")
    print(f"✅ Created 'papers.db' with {count} papers")
    
    # Show sample
    cursor.execute('SELECT id, title FROM papers LIMIT 3')
    samples = cursor.fetchall()
    print("\n📄 Sample papers:")
    
    conn.close()

if __name__ == "__main__":
    init_database()
