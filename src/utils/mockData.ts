import { v4 as uuidv4 } from 'uuid';
import type { Chat, Folder, Agent, Message } from '../types';

// Generate sample folders
export const generateSampleFolders = (): Folder[] => {
  return [
    {
      id: uuidv4(),
      name: 'Market Analysis',
      createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
    },
    {
      id: uuidv4(),
      name: 'Trading Strategies',
      createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
    },
    {
      id: uuidv4(),
      name: 'Investment Research',
      createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
    },
  ];
};

// Generate sample agents
export const generateSampleAgents = (): Agent[] => {
  return [
    {
      id: uuidv4(),
      name: 'General Assistant',
      systemPrompt: 'You are a helpful AI assistant that provides clear and concise information.',
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    },
    {
      id: uuidv4(),
      name: 'Market Analyst',
      systemPrompt: 'You are a financial market expert specialized in analyzing market trends, stocks, and investment opportunities.',
      model: 'gpt-4',
      temperature: 0.5,
      createdAt: Date.now() - 8 * 24 * 60 * 60 * 1000,
    },
    {
      id: uuidv4(),
      name: 'Code Helper',
      systemPrompt: 'You are a programming assistant that helps with code examples, debugging, and explaining technical concepts.',
      model: 'gpt-4',
      temperature: 0.3,
      createdAt: Date.now() - 6 * 24 * 60 * 60 * 1000,
    },
  ];
};

// Generate sample messages for a chat
const generateSampleMessages = (chatType: string): Message[] => {
  const timestamp = Date.now();
  
  if (chatType === 'market') {
    return [
      {
        id: uuidv4(),
        role: 'user',
        content: 'Can you analyze the current tech stock market trends?',
        timestamp: timestamp - 35 * 60 * 1000, // 35 minutes ago
      },
      {
        id: uuidv4(),
        role: 'assistant',
        content: "Based on recent data, tech stocks are showing mixed performance. Large tech companies like Apple, Microsoft, and Google have demonstrated resilience, while smaller tech firms are experiencing more volatility.\n\nKey observations:\n\n1. **Cloud Services**: Companies focused on cloud infrastructure are outperforming the broader market\n2. **AI Sector**: Firms with strong AI capabilities are attracting significant investment\n3. **Semiconductor Industry**: Facing supply chain challenges but showing long-term growth potential\n\nWould you like me to focus on any specific segment of the tech market for a more detailed analysis?",
        timestamp: timestamp - 34 * 60 * 1000, // 34 minutes ago
      },
      {
        id: uuidv4(),
        role: 'user',
        content: 'What are your recommendations for AI-focused stocks?',
        timestamp: timestamp - 30 * 60 * 1000, // 30 minutes ago
      },
      {
        id: uuidv4(),
        role: 'assistant',
        content: "When considering AI-focused stocks, it's important to distinguish between different categories:\n\n**1. AI Infrastructure Providers:**\n- Companies providing the computational resources necessary for AI development\n- Examples include NVIDIA (GPUs), AMD, and cloud providers like AWS, Microsoft Azure, and Google Cloud\n\n**2. AI Software Developers:**\n- Companies creating AI platforms and applications\n- This includes both large tech firms with AI divisions and specialized AI startups\n\n**3. Industry-Specific AI Applications:**\n- Companies applying AI in specific domains like healthcare, finance, and autonomous vehicles\n\nKey considerations for investing in AI stocks:\n\n- Look for companies with proprietary AI technology and strong intellectual property\n- Consider the moat and competitive advantage in their specific AI niche\n- Evaluate the practical applications and revenue potential of their AI solutions\n- Assess their data advantages, as high-quality data is crucial for AI development\n\nA balanced approach might include investing in established companies with strong AI capabilities while also considering select emerging players with innovative technology.",
        timestamp: timestamp - 28 * 60 * 1000, // 28 minutes ago
      },
    ];
  } else if (chatType === 'code') {
    return [
      {
        id: uuidv4(),
        role: 'user',
        content: 'How do I create a simple React component with TypeScript?',
        timestamp: timestamp - 2 * 60 * 60 * 1000, // 2 hours ago
      },
      {
        id: uuidv4(),
        role: 'assistant',
        content: "Here's how to create a basic React component with TypeScript:\n\n```tsx\nimport React, { useState } from 'react';\n\n// Define the props interface\ninterface ButtonProps {\n  text: string;\n  onClick?: () => void;\n  color?: 'primary' | 'secondary' | 'default';\n}\n\n// Create the component\nconst Button: React.FC<ButtonProps> = ({ \n  text, \n  onClick, \n  color = 'default' \n}) => {\n  const [isHovered, setIsHovered] = useState(false);\n  \n  // Determine the button class based on color prop\n  const getButtonClass = () => {\n    switch (color) {\n      case 'primary':\n        return 'bg-blue-500 hover:bg-blue-600';\n      case 'secondary':\n        return 'bg-purple-500 hover:bg-purple-600';\n      default:\n        return 'bg-gray-200 hover:bg-gray-300';\n    }\n  };\n  \n  return (\n    <button\n      className={`px-4 py-2 rounded ${getButtonClass()} transition-colors`}\n      onClick={onClick}\n      onMouseEnter={() => setIsHovered(true)}\n      onMouseLeave={() => setIsHovered(false)}\n    >\n      {text} {isHovered ? '👆' : ''}\n    </button>\n  );\n};\n\nexport default Button;\n```\n\nTo use this component:\n\n```tsx\nimport Button from './Button';\n\nfunction App() {\n  return (\n    <div className=\"p-4\">\n      <Button \n        text=\"Click Me\" \n        color=\"primary\" \n        onClick={() => console.log('Button clicked!')} \n      />\n    </div>\n  );\n}\n```\n\nThis example demonstrates:\n1. TypeScript interfaces for props\n2. Default prop values\n3. Component state with TypeScript\n4. Conditional styling\n5. Event handling\n\nWould you like me to explain any part in more detail?",
        timestamp: timestamp - 1.9 * 60 * 60 * 1000, // 1.9 hours ago
      },
    ];
  } else {
    return [
      {
        id: uuidv4(),
        role: 'user',
        content: 'Hello! Can you tell me about yourself?',
        timestamp: timestamp - 1 * 24 * 60 * 60 * 1000 - 5 * 60 * 1000, // 1 day and 5 minutes ago
      },
      {
        id: uuidv4(),
        role: 'assistant',
        content: "Hello! I'm an AI assistant designed to help with a wide range of tasks and questions. I can provide information, assist with problem-solving, generate creative content, and engage in conversations on various topics.\n\nI'm trained on a diverse dataset that allows me to understand and respond to many different types of queries, though my knowledge has a cutoff date and I don't have access to real-time information unless it's provided in our conversation.\n\nHow can I assist you today? Feel free to ask me about any topic you're interested in, and I'll do my best to help!",
        timestamp: timestamp - 1 * 24 * 60 * 60 * 1000 - 4 * 60 * 1000, // 1 day and 4 minutes ago
      },
      {
        id: uuidv4(),
        role: 'user',
        content: "What's the difference between machine learning and deep learning?",
        timestamp: timestamp - 1 * 24 * 60 * 60 * 1000 - 2 * 60 * 1000, // 1 day and 2 minutes ago
      },
      {
        id: uuidv4(),
        role: 'assistant',
        content: "# Machine Learning vs. Deep Learning\n\n## Machine Learning\n\nMachine Learning (ML) is a subset of AI that enables systems to learn and improve from experience without being explicitly programmed. It uses algorithms to parse data, learn from it, and make informed decisions.\n\n**Key characteristics:**\n- Often requires feature engineering (manual selection of relevant data features)\n- Works well with structured data\n- Typically requires less computational power\n- Can work effectively with smaller datasets\n- Examples: Random Forests, SVMs, Gradient Boosting, k-means clustering\n\n## Deep Learning\n\nDeep Learning is a specialized subset of Machine Learning that uses neural networks with many layers (hence \"deep\") to analyze various factors of data.\n\n**Key characteristics:**\n- Automatically performs feature extraction\n- Excels with unstructured data (images, text, audio)\n- Requires significant computational resources\n- Generally needs large amounts of data\n- Uses neural networks with multiple hidden layers\n- Examples: CNNs, RNNs, LSTMs, Transformers\n\n## Summary of Differences\n\n| Aspect | Machine Learning | Deep Learning |\n|--------|-----------------|---------------|\n| Data requirements | Can work with smaller datasets | Typically needs large amounts of data |\n| Feature engineering | Often manual | Automatic feature extraction |\n| Interpretability | Generally more interpretable | Often a \"black box\" |\n| Computational needs | Less intensive | Highly intensive |\n| Training time | Usually faster | Usually slower |\n| Best for | Structured data, smaller datasets | Complex tasks, unstructured data |",
        timestamp: timestamp - 1 * 24 * 60 * 60 * 1000, // 1 day ago
      },
    ];
  }
};

// Generate sample chats
export const generateSampleChats = (folders: Folder[], agents: Agent[]): Chat[] => {
  const marketFolder = folders.find(folder => folder.name === 'Market Analysis');
  const tradingFolder = folders.find(folder => folder.name === 'Trading Strategies');
  
  const marketAgent = agents.find(agent => agent.name === 'Market Analyst');
  const codeAgent = agents.find(agent => agent.name === 'Code Helper');
  const generalAgent = agents.find(agent => agent.name === 'General Assistant');
  
  return [
    {
      id: uuidv4(),
      title: 'Tech Stock Analysis',
      folderId: marketFolder?.id || null,
      agentId: marketAgent?.id || null,
      messages: generateSampleMessages('market'),
      createdAt: Date.now() - 36 * 60 * 1000, // 36 minutes ago
      updatedAt: Date.now() - 28 * 60 * 1000, // 28 minutes ago
    },
    {
      id: uuidv4(),
      title: 'React Component Tutorial',
      folderId: null,
      agentId: codeAgent?.id || null,
      messages: generateSampleMessages('code'),
      createdAt: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
      updatedAt: Date.now() - 1.9 * 60 * 60 * 1000, // 1.9 hours ago
    },
    {
      id: uuidv4(),
      title: 'ML vs DL Explanation',
      folderId: null,
      agentId: generalAgent?.id || null,
      messages: generateSampleMessages('general'),
      createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000 - 5 * 60 * 1000, // 1 day and 5 minutes ago
      updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
    },
  ];
};

// Initialize sample data
export const initializeSampleData = () => {
  const folders = generateSampleFolders();
  const agents = generateSampleAgents();
  const chats = generateSampleChats(folders, agents);
  
  return {
    folders,
    agents,
    chats,
  };
};