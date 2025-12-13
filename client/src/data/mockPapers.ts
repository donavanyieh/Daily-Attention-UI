export interface Paper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  date: string;
  upvotes: number;
  tags: string[];
  thumbnail?: string;
}

export const mockPapers: Paper[] = [
  {
    id: "2312.12456",
    title: "Gemini: A Family of Highly Capable Multimodal Models",
    authors: ["Google DeepMind Team"],
    abstract: "We introduce Gemini, a family of highly capable multimodal models. We show that Gemini Ultra performance exceeds current state-of-the-art results on 30 of the 32 widely-used academic benchmarks used in LLM research and development. With a score of 90.0%, Gemini Ultra is the first model to outperform human experts on MMLU (massive multitask language understanding), which uses a combination of 57 subjects such as math, physics, history, law, medicine and ethics for testing both world knowledge and problem-solving abilities.",
    date: "2023-12-06",
    upvotes: 4521,
    tags: ["Language Models", "Multimodal", "Deep Learning"]
  },
  {
    id: "2311.09213",
    title: "ZipLoRA: Any-Subject Any-Style Personalization",
    authors: ["Viraj Shah", "Nataniel Ruiz", "F. Cole", "Erika Lu", "S. Lazebnik", "Y. Li", "Varun Jampani"],
    abstract: "We propose ZipLoRA, a method to merge independently trained style and subject LoRAs in order to achieve generation of any user-provided subject in any user-provided style. Methods for personalization of text-to-image diffusion models have enabled the generation of specific subjects and styles. However, existing methods often struggle to compose style and subject effectively.",
    date: "2023-11-15",
    upvotes: 1240,
    tags: ["Computer Vision", "Generative Art", "LoRA"]
  },
  {
    id: "2310.06825",
    title: "Mistral 7B",
    authors: ["Albert Q. Jiang", "Alexandre Sablayrolles", "Arthur Mensch", "Chris Bamford", "Devendra Singh Chaplot", "Diego de las Casas", "Florian Bressand", "Gianna Lengyel", "Guillaume Lample", "Lucile Saulnier"],
    abstract: "We introduce Mistral 7B, a 7-billion-parameter language model engineered for superior performance and efficiency. Mistral 7B outperforms Llama 2 13B across all evaluated benchmarks, and Llama 1 34B on many benchmarks. In particular, Mistral 7B approaches CodeLlama 7B performance on code, while remaining good at English tasks. It uses Grouped-query attention (GQA) for faster inference and Sliding Window Attention (SWA) to handle longer sequences at smaller cost.",
    date: "2023-10-10",
    upvotes: 3890,
    tags: ["NLP", "Efficient LLMs", "Open Source"]
  },
  {
    id: "2309.15217",
    title: "Textbooks Are All You Need",
    authors: ["Surya Gunasekar", "Yi Zhang", "Jyoti Aneja", "Caio César Teodoro Mendes", "Allie Del Giorno", "Sivakanth Gopi", "Mojan Javaheripi", "Piero Kauffmann", "Gustavo de Rosa", "Olli Saarikivi", "Adil Salim", "Shital Shah", "Harkirat Singh Behl", "Xin Wang", "Sébastien Bubeck", "Ronen Eldan", "Adam Tauman Kalai", "Yin Tat Lee", "Yuanzhi Li"],
    abstract: "We introduce phi-1, a new large language model for code, with significantly smaller size than competing models: phi-1 is a Transformer-based model with 1.3 billion parameters, trained for 4 days on 8 A100s, using a selection of 'textbook quality' data from the web (6B tokens) and synthetically generated textbooks and exercises with GPT-3.5 (1B tokens). Despite this small scale, phi-1 attains pass@1 accuracy 50.6% on HumanEval and 55.5% on MBPP.",
    date: "2023-09-20",
    upvotes: 2100,
    tags: ["Synthetic Data", "Small Models", "Coding"]
  },
  {
    id: "2401.13294",
    title: "Depth Anything: Unleashing the Power of Large-Scale Unlabeled Data",
    authors: ["Lihe Yang", "Bingyi Kang", "Zilong Huang", "Xiaogang Xu", "Jiashi Feng", "Hengshuang Zhao"],
    abstract: "This work presents Depth Anything, a highly practical solution for robust monocular depth estimation. Without pursuing novel technical modules, we aim to build a simple yet powerful foundation model for depth estimation by scaling up the dataset. To this end, we collect 1.5M labeled images and 62M unlabeled images. We design a data engine to automatically annotate the unlabeled data, which significantly boosts the performance.",
    date: "2024-01-22",
    upvotes: 1850,
    tags: ["Computer Vision", "Depth Estimation", "Self-Supervised Learning"]
  },
  {
    id: "2402.01234",
    title: "Sora: Video Generation Models as World Simulators",
    authors: ["OpenAI Team"],
    abstract: "We explore large-scale training of generative models on video data. Specifically, we train text-conditional diffusion models jointly on videos and images of variable durations, resolutions and aspect ratios. We leverage a transformer architecture that operates on spacetime patches of video and image latent codes. Our largest model, Sora, is capable of generating a minute of high fidelity video. We verify that scaling video generation models is a promising path towards building general purpose simulators of the physical world.",
    date: "2024-02-15",
    upvotes: 8900,
    tags: ["Video Generation", "Diffusion Models", "Transformers"]
  }
];
