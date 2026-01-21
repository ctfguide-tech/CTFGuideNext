export const rankColors = {
    Gold: {
        border: 'border-yellow-500',
        text: 'text-yellow-500',
        bg: 'bg-yellow-900/50',
        ring: 'ring-yellow-500/20',
        hoverBorder: 'hover:border-yellow-400',
        focusRing: 'focus:ring-yellow-500',
    },
    Diamond: {
        border: 'border-cyan-500',
        text: 'text-cyan-500',
        bg: 'bg-cyan-900/50',
        ring: 'ring-cyan-500/20',
        hoverBorder: 'hover:border-cyan-400',
        focusRing: 'focus:ring-cyan-500',
    },
};

export const mockBounties = [
    {
        id: 5,
        company: 'Synack',
        title: 'Synack - Crowdsourced Security Testing Platform',
        category: 'Security',
        logo: 'https://www.synack.com/wp-content/uploads/2023/04/synack-red-team-svg-2.svg',
        description: 'Exclusive access to our private bug bounty programs. Only for top-ranked researchers.',
        targets: ['platform.synack.com'],
        rewards: { critical: '25000', high: '10000', medium: '5000', low: '1000' },
        vuln_types: ['Web Application', 'Mobile', 'Network', 'Host'],
        history: [],
        requiredRank: 'Diamond'
      },
    {
        id: 4,
        company: 'Cluely',
        title: 'Cluely – Cheat on everything',
        category: 'Desktop AI Assistant',
        logo: 'https://media.licdn.com/dms/image/v2/D560BAQFPDCGXilJm2g/company-logo_200_200/B56ZblmJB2H4AI-/0/1747608705117/cluely_logo?e=2147483647&v=beta&t=JNygewi41TBDr_LIyWVo_smWOhKD2q3GXkos83PZ6ck',
        description: 'Cluely is an AI‑powered desktop assistant that invisibly monitors your screen and audio during meetings, sales calls, coding interviews, or solo workflows—then feeds you context‑aware prompts and answers in real time.',
        targets: ['cluely.com', 'app.cluely.ai'],
        rewards: { critical: '5000', high: '2500', medium: '1000', low: '250' },
        vuln_types: ['Screen/audio privacy', 'Data leakage', 'Access control', 'API security', 'Overlay spoofing'],
        
       
        history: [
            { user: 'hacker_one', vulnerability: 'Critical RCE', reward: 10000, date: '2023-05-15' },
            { user: 'another_user', vulnerability: 'Medium XSS', reward: 2000, date: '2023-04-20' }
          ]
      },
  {
    id: 1,
    company: 'Replit',
    title: 'Replit - The collaborative browser based IDE',
    category: 'Web Application',
    logo: 'https://play-lh.googleusercontent.com/baV9RL2D0iV8JkTtCzSxeLf6XxCJMWQYbyXMqyQfc0OQGtjkCyUenUbLb5tefYfMxfU',
    description: 'Help secure our platform that provides a collaborative, browser-based IDE. We are looking for a wide range of web vulnerabilities.',
    targets: ['replit.com', 'api.replit.com'],
    rewards: { critical: '10000', high: '5000', medium: '2000', low: '500' },
    vuln_types: ['RCE', 'SSRF', 'Container Escape', 'XSS'],
    history: [
      { user: 'hacker_one', vulnerability: 'Critical RCE', reward: 10000, date: '2023-05-15' },
      { user: 'another_user', vulnerability: 'Medium XSS', reward: 2000, date: '2023-04-20' }
    ]
  },
  {
    id: 2,
    company: 'OpenSea',
    title: 'OpenSea - The largest NFT marketplace',
    category: 'Web3',
    logo: 'https://storage.googleapis.com/opensea-static/Logomark/Logomark-Blue.svg',
    description: 'Secure the world\'s largest NFT marketplace. We are offering rewards for vulnerabilities related to smart contracts and our web platform.',
    targets: ['opensea.io', 'api.opensea.io', 'Smart Contracts'],
    rewards: { critical: '100000', high: '25000', medium: '10000', low: '2500' },
    vuln_types: ['Smart Contract Exploit', 'Re-entrancy', 'Transaction Gas Optimization', 'Web3 Injection'],
    history: [
      { user: 'sec_researcher', vulnerability: 'Re-entrancy on listing', reward: 25000, date: '2023-06-01' }
    ],
    requiredRank: 'Gold'
  },
  {
    id: 3,
    company: 'Deel',
    title: 'Deel - The all-in-one HR platform for global teams',
    category: 'Financial',
    logo: 'https://cdn.prod.website-files.com/5f15081919fdf673994ab5fd/66021319743010423fabbff9_Deel-Logo.svg',
    description: 'Help us secure our HR platform for global teams. We are looking for vulnerabilities in our payment systems, and data handling.',
    targets: ['deel.com', 'api.deel.com'],
    rewards: { critical: '15000', high: '7500', medium: '3000', low: '1000' },
    vuln_types: ['Business Logic Errors', 'Payment Flaws', 'Information Disclosure', 'Access Control'],
    history: []
  },
]; 