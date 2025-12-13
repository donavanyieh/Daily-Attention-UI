export interface Paper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  summary: string;
  keyPoints: string[];
  impact: string;
  links: {
    github?: string;
    data?: string;
    project?: string;
  };
  date: string;
  upvotes: number;
  tags: string[];
}

export const mockPapers: Paper[] = [
  {
    id: "2312.12456",
    title: "Gemini: A Family of Highly Capable Multimodal Models",
    authors: ["Google DeepMind Team"],
    abstract: "We introduce Gemini, a family of highly capable multimodal models. We show that Gemini Ultra performance exceeds current state-of-the-art results on 30 of the 32 widely-used academic benchmarks used in LLM research and development.",
    summary: "Gemini represents a significant leap in multimodal AI, offering a unified model capable of understanding and generating text, code, audio, image, and video. It sets new state-of-the-art records across a vast array of benchmarks, demonstrating reasoning capabilities that rival or surpass human experts in specific domains.",
    keyPoints: [
      "First model to outperform human experts on MMLU (90.0%).",
      "Built from the ground up to be multimodal (text, image, audio, video).",
      "Available in three sizes: Ultra, Pro, and Nano for different compute constraints.",
      "Sophisticated reasoning capabilities in math and coding."
    ],
    impact: "This model pushes the boundary of what's possible with unified multimodal systems, potentially replacing specialized models for vision and audio with a single general-purpose foundation model. It enables more natural cross-modal interactions for users.",
    links: {
      project: "https://deepmind.google/technologies/gemini/",
      github: "https://github.com/google-deepmind"
    },
    date: "2023-12-06",
    upvotes: 4521,
    tags: ["Language Models", "Multimodal", "Deep Learning"]
  },
  {
    id: "2311.09213",
    title: "ZipLoRA: Any-Subject Any-Style Personalization",
    authors: ["Viraj Shah", "Nataniel Ruiz", "F. Cole", "Erika Lu", "S. Lazebnik", "Y. Li", "Varun Jampani"],
    abstract: "We propose ZipLoRA, a method to merge independently trained style and subject LoRAs in order to achieve generation of any user-provided subject in any user-provided style.",
    summary: "ZipLoRA introduces a novel technique for merging Low-Rank Adaptations (LoRAs) that allows for precise control over both subject and style in generative image models. Unlike previous methods that often degrade quality when combining adapters, ZipLoRA preserves the integrity of both the subject's identity and the artistic style.",
    keyPoints: [
      "Enables high-fidelity generation of specific subjects in specific styles.",
      "Optimizes the merging of independently trained LoRA modules.",
      "Overcomes the 'forgetting' problem seen in naive model merging.",
      "Compatible with existing Stable Diffusion based workflows."
    ],
    impact: "Crucial for creative professionals and concept artists who need to maintain brand consistency (subject) while exploring different visual aesthetics (style). It significantly enhances the flexibility of generative art workflows.",
    links: {
      github: "https://github.com/google-research/ziplora",
      project: "https://ziplora.github.io/"
    },
    date: "2023-11-15",
    upvotes: 1240,
    tags: ["Computer Vision", "Generative Art", "LoRA"]
  },
  {
    id: "2310.06825",
    title: "Mistral 7B",
    authors: ["Albert Q. Jiang", "Alexandre Sablayrolles", "Arthur Mensch", "et al."],
    abstract: "We introduce Mistral 7B, a 7-billion-parameter language model engineered for superior performance and efficiency. Mistral 7B outperforms Llama 2 13B across all evaluated benchmarks.",
    summary: "Mistral 7B proves that smaller, well-optimized models can outperform significantly larger competitors. By utilizing Grouped-query attention (GQA) and Sliding Window Attention (SWA), it delivers high performance with reduced inference costs, making powerful LLMs accessible on consumer hardware.",
    keyPoints: [
      "Outperforms Llama 2 13B despite having nearly half the parameters.",
      "Uses Sliding Window Attention (SWA) to handle longer sequences efficiently.",
      "Open weights release empowers the open-source community.",
      "Strong performance on code generation and reasoning tasks."
    ],
    impact: "Democratizes access to high-performance LLMs. It shifts the focus from 'bigger is better' to 'efficiency and architecture matter', enabling more developers to run powerful models locally or on smaller servers.",
    links: {
      github: "https://github.com/mistralai/mistral-src",
      data: "https://huggingface.co/mistralai/Mistral-7B-v0.1"
    },
    date: "2023-10-10",
    upvotes: 3890,
    tags: ["NLP", "Efficient LLMs", "Open Source"]
  },
  {
    id: "2309.15217",
    title: "Textbooks Are All You Need",
    authors: ["Surya Gunasekar", "Yi Zhang", "Jyoti Aneja", "et al."],
    abstract: "We introduce phi-1, a new large language model for code, with significantly smaller size than competing models: phi-1 is a Transformer-based model with 1.3 billion parameters.",
    summary: "This paper challenges the scaling laws by demonstrating that data quality matters more than quantity. By training on 'textbook quality' synthetic data, the phi-1 model achieves remarkable coding performance with only 1.3 billion parameters, rivaling much larger models trained on raw web data.",
    keyPoints: [
      "Highlights the critical importance of high-quality, curated training data.",
      "Achieves 50.6% pass@1 on HumanEval with only 1.3B parameters.",
      "Uses synthetic data generation to create 'textbook' quality learning materials.",
      "Drastically reduces training time and compute requirements."
    ],
    impact: "Revolutionizes data curation strategies. It suggests that future model improvements may come from better data engineering rather than just larger compute clusters, potentially reducing the environmental impact of training AI.",
    links: {
      data: "https://huggingface.co/microsoft/phi-1",
      project: "https://www.microsoft.com/en-us/research/publication/textbooks-are-all-you-need/"
    },
    date: "2023-09-20",
    upvotes: 2100,
    tags: ["Synthetic Data", "Small Models", "Coding"]
  },
  {
    id: "2401.13294",
    title: "Depth Anything: Unleashing the Power of Large-Scale Unlabeled Data",
    authors: ["Lihe Yang", "Bingyi Kang", "Zilong Huang", "et al."],
    abstract: "This work presents Depth Anything, a highly practical solution for robust monocular depth estimation. We aim to build a simple yet powerful foundation model for depth estimation.",
    summary: "Depth Anything is a foundation model for monocular depth estimation that leverages massive amounts of unlabeled data. By designing a data engine to automatically annotate this data, the model learns to perceive depth with unprecedented robustness and accuracy, even in challenging scenarios.",
    keyPoints: [
      "Trained on 1.5M labeled and 62M unlabeled images.",
      "Sets new state-of-the-art for zero-shot depth estimation.",
      "Robust foundation model capable of handling diverse scenes.",
      "Simple architecture focused on data scaling rather than complex modules."
    ],
    impact: "Solves a fundamental problem in computer vision—depth perception from a single camera. This has immediate applications in autonomous driving, robotics, and augmented reality, making depth sensing cheaper and more accessible.",
    links: {
      github: "https://github.com/LiheYoung/Depth-Anything",
      project: "https://depth-anything.github.io/"
    },
    date: "2024-01-22",
    upvotes: 1850,
    tags: ["Computer Vision", "Depth Estimation", "Self-Supervised Learning"]
  },
  {
    id: "2402.01234",
    title: "Sora: Video Generation Models as World Simulators",
    authors: ["OpenAI Team"],
    abstract: "We explore large-scale training of generative models on video data. We leverage a transformer architecture that operates on spacetime patches of video and image latent codes.",
    summary: "Sora is a text-to-video model that can generate minute-long videos while maintaining high visual quality and adherence to the user's prompt. It treats video generation as a world simulation problem, understanding physics, object permanence, and complex interactions within the generated scene.",
    keyPoints: [
      "Generates high-fidelity videos up to 60 seconds long.",
      "Understands 3D consistency and object permanence.",
      "Uses a transformer architecture on spacetime patches.",
      "Simulates physical world interactions with impressive accuracy."
    ],
    impact: "Redefines the capabilities of generative video, moving from short, glitchy clips to coherent, minute-long narratives. It has profound implications for filmmaking, game development, and simulation training, while also raising important questions about deepfakes and content authenticity.",
    links: {
      project: "https://openai.com/sora"
    },
    date: "2024-02-15",
    upvotes: 8900,
    tags: ["Video Generation", "Diffusion Models", "Transformers"]
  }
];
