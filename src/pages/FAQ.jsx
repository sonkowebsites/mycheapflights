import { useState } from 'react';
import { ChevronDown, Search, HelpCircle, Plane, CreditCard, Luggage, AlertCircle, RefreshCw } from 'lucide-react';
import styles from './FAQ.module.css';

const CATEGORIES = [
  { id: 'all', label: 'All Questions', icon: HelpCircle },
  { id: 'search', label: 'Searching Flights', icon: Plane },
  { id: 'booking', label: 'Booking & Payment', icon: CreditCard },
  { id: 'baggage', label: 'Baggage & Travel', icon: Luggage },
  { id: 'changes', label: 'Changes & Refunds', icon: RefreshCw },
  { id: 'account', label: 'My Account', icon: AlertCircle },
];

const FAQS = [
  {
    category: 'search',
    question: 'How does MyCheapFlights find the cheapest prices?',
    answer: `MyCheapFlights uses advanced algorithms to scan over 800 airlines, online travel agencies, and fare aggregators simultaneously in real time. We compare hundreds of price combinations — including hidden city ticketing, multi-stop routings, and flexible date windows — to surface the absolute lowest fare available for your journey.\n\nOur technology refreshes every few minutes to ensure you always see the most current prices.`,
  },
  {
    category: 'search',
    question: 'What is the best time to search for cheap flights?',
    answer: `Research consistently shows that booking 6–8 weeks before a domestic flight and 3–5 months before an international flight gives you the best chance of a low fare. \n\nFor day-of-week, Tuesday and Wednesday searches tend to yield cheaper results as airline sales typically launch on Monday nights. Flying on Tuesday, Wednesday, or Saturday is generally cheaper than Monday or Friday.\n\nUse our Price Drop Alerts to set a target price — we'll notify you the moment fares reach your budget.`,
  },
  {
    category: 'search',
    question: 'Can I search for flights from Uganda to the USA?',
    answer: `Absolutely! MyCheapFlights specializes in international routes including Uganda (Entebbe International – EBB) to major US cities like New York (JFK/EWR), Washington D.C. (IAD/DCA), Atlanta (ATL), and more.\n\nPopular connections include Ethiopian Airlines via Addis Ababa, Kenya Airways via Nairobi, Emirates via Dubai, and Qatar Airways via Doha. We compare all these options to find your best deal.`,
  },
  {
    category: 'search',
    question: 'What does "nonstop", "direct", and "connecting" mean?',
    answer: `• **Nonstop**: The plane flies straight from origin to destination with no stops.\n• **Direct**: The flight has the same flight number but may stop at an intermediate city (passengers usually stay on board).\n• **Connecting**: You change planes at least once. The stop city will be shown on your results.\n\nNonstop flights are fastest and most convenient, while connecting flights are often significantly cheaper.`,
  },
  {
    category: 'booking',
    question: 'Does MyCheapFlights charge booking fees?',
    answer: `No! MyCheapFlights is completely free to use. We do not charge any booking fees or service fees. When you click "Book Now," you are taken directly to the airline's or travel agency's website to complete your purchase — the price you see is the price you pay.\n\nWe earn revenue through affiliate commissions from our booking partners, which never affects the prices you see.`,
  },
  {
    category: 'booking',
    question: 'What payment methods are accepted?',
    answer: `Payment methods depend on the airline or travel agency you book with. Most accept:\n\n• Visa, Mastercard, American Express, Discover credit/debit cards\n• PayPal and digital wallets (Apple Pay, Google Pay)\n• Bank transfers (some international routes)\n• Installment plans via Affirm, Klarna, or Afterpay (varies by partner)\n\nAlways check the payment page before completing checkout.`,
  },
  {
    category: 'booking',
    question: 'Is my personal and payment information secure?',
    answer: `Your security is our top priority. MyCheapFlights uses 256-bit SSL encryption for all data transmission. We are PCI-DSS compliant and never store your payment card information on our servers.\n\nWhen you proceed to book, you are transferred to the airline or travel agency's fully secured checkout environment. Look for the padlock icon and "https://" in your browser address bar.`,
  },
  {
    category: 'baggage',
    question: 'What is the standard baggage allowance?',
    answer: `Baggage policies vary by airline and ticket class:\n\n**Economy Class:**\n• Personal item: Usually included (fits under seat)\n• Carry-on: Often included (check with airline)\n• Checked bag: Varies — many US domestic flights charge $30–$35 per bag\n\n**Business/First Class:**\n• Usually includes 2 checked bags up to 32kg each\n\nWe display estimated baggage information on each flight result. Always confirm the exact policy on the airline's website before booking.`,
  },
  {
    category: 'baggage',
    question: 'What items are not allowed on flights?',
    answer: `Items prohibited in carry-on (but may be checked):\n• Liquids over 100ml (3.4oz) in carry-on\n• Sharp objects (scissors, knives)\n• Sports equipment\n\nItems never allowed:\n• Explosives and flammable items\n• Lithium batteries over 160Wh\n• Firearms (without special authorization)\n\nAlways check TSA guidelines (for US flights) or your destination country's aviation authority for the most current restrictions.`,
  },
  {
    category: 'changes',
    question: 'Can I cancel or change my flight after booking?',
    answer: `Change and cancellation policies depend on the fare type you purchased:\n\n• **Refundable fares**: Can typically be cancelled for a full refund, and changed for free or a small fee.\n• **Non-refundable fares**: Usually can be changed (for a fee + fare difference) but not refunded in cash — you may receive travel credit.\n• **Basic Economy**: Generally the most restrictive — changes and cancellations may not be permitted.\n\nWe clearly mark "Refundable" flights in our results. Always read the fare rules before booking.`,
  },
  {
    category: 'changes',
    question: 'What if my flight is delayed or cancelled by the airline?',
    answer: `If the airline cancels or significantly delays your flight, you are entitled to:\n\n• **US domestic flights (DOT rules)**: Full refund if the airline cancels or makes a significant change\n• **EU flights (EC 261/2004)**: Compensation of €250–€600 plus meals/hotel depending on delay length and distance\n\nContact the airline directly for rebooking or refund. If you purchased travel insurance, file a claim with your insurer as well. MyCheapFlights can't make changes on your behalf since bookings are managed directly by the airline/agency.`,
  },
  {
    category: 'account',
    question: 'How do I create a MyCheapFlights account?',
    answer: `Creating an account is free and takes under 60 seconds:\n\n1. Click "Sign Up" in the top navigation bar\n2. Choose to sign up with your Email, Phone Number, or Google account\n3. Fill in your details and create a secure password\n4. Verify your email or phone number\n\nWith an account you can save searches, set price alerts, view booking history, and get personalized flight recommendations.`,
  },
  {
    category: 'account',
    question: 'How do price drop alerts work?',
    answer: `Price alerts are one of our most powerful features:\n\n1. Search for a flight route\n2. Click the bell icon or "Set Price Alert" on any result\n3. Enter your target price (or use our suggestion)\n4. We monitor prices 24/7 and email/SMS you instantly when fares drop\n\nYou can manage all your alerts from your account dashboard. We also send weekly price forecasts to help you decide the best time to book.`,
  },
  {
    category: 'account',
    question: 'How do I delete my MyCheapFlights account?',
    answer: `You can delete your account at any time:\n\n1. Go to Settings > Account\n2. Scroll to "Delete Account"\n3. Confirm your password and submit the request\n\nYour data will be permanently removed within 30 days in accordance with our Privacy Policy and GDPR/CCPA regulations. If you just want to stop emails, you can unsubscribe without deleting your account.`,
  },
];

function FAQItem({ faq }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`${styles.faqItem} ${open ? styles.open : ''}`}>
      <button
        className={styles.faqQuestion}
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        <span>{faq.question}</span>
        <div className={`${styles.chevron} ${open ? styles.chevronUp : ''}`}>
          <ChevronDown size={18} />
        </div>
      </button>
      <div className={styles.faqAnswerWrap}>
        <div className={styles.faqAnswer}>
          {faq.answer.split('\n').map((line, i) => (
            line.trim() ? (
              <p key={i} dangerouslySetInnerHTML={{
                __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/^•\s/, '<span class="bullet">•</span> ')
              }} />
            ) : <br key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = FAQS.filter(f => {
    const matchCat = activeCategory === 'all' || f.category === activeCategory;
    const matchSearch = !searchQuery ||
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className="container">
          <span className="badge badge-cyan">
            <HelpCircle size={12} /> FAQ
          </span>
          <h1 className={`section-title ${styles.heroTitle}`}>
            Frequently Asked <span className="gradient-text">Questions</span>
          </h1>
          <p className={`section-subtitle ${styles.heroSub}`}>
            Everything you need to know about searching and booking flights with MyCheapFlights.
          </p>

          {/* Search */}
          <div className={styles.searchWrap}>
            <div className={styles.searchBox}>
              <Search size={18} className={styles.searchIcon} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search questions..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className={styles.layout}>
          {/* Categories sidebar */}
          <aside className={styles.categorySidebar}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`${styles.catBtn} ${activeCategory === cat.id ? styles.catActive : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <cat.icon size={16} />
                <span>{cat.label}</span>
                <span className={styles.catCount}>
                  {cat.id === 'all' ? FAQS.length : FAQS.filter(f => f.category === cat.id).length}
                </span>
              </button>
            ))}
          </aside>

          {/* FAQ list */}
          <div className={styles.faqList}>
            {filtered.length === 0 ? (
              <div className={styles.noResults}>
                <p style={{ fontSize: '2rem' }}>🔍</p>
                <h3>No questions found</h3>
                <p>Try a different search term or category.</p>
                <button className="btn-primary" onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>
                  View All Questions
                </button>
              </div>
            ) : (
              filtered.map((faq, i) => (
                <FAQItem key={i} faq={faq} />
              ))
            )}
          </div>
        </div>

        {/* CTA */}
        <div className={styles.ctaBox}>
          <h3 className={styles.ctaTitle}>Still have questions?</h3>
          <p className={styles.ctaText}>
            Our AI assistant SkyBot is available 24/7 to answer any travel question instantly.
          </p>
          <div className={styles.ctaBtns}>
            <button
              className="btn-primary"
              onClick={() => document.querySelector('[aria-label="Open chat assistant"]')?.click()}
            >
              Chat with SkyBot AI
            </button>
            <a href="mailto:support@mycheapflights.com" className="btn-secondary">
              Email Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
