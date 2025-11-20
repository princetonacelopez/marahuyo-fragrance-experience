import React, { useState, useEffect, useRef } from 'react'
import { ArrowRight, X, Sparkles } from 'lucide-react'
import AtmosphereCanvas from '../ui/AtmosphereCanvas'
import NoiseOverlay from '../ui/NoiseOverlay'
import WispCursor from '../ui/WispCursor'
import FRAGRANCES from '../data/fragrances.json'
import QUIZ_QUESTIONS from '../data/quiz.json'

export default function MarahuyoApp(){
  const [view, setView] = useState('PORTAL')
  const [activeProduct, setActiveProduct] = useState(null)
  const [cart, setCart] = useState([])

  // Portal hold state
  const [holding, setHolding] = useState(false)
  const [progress, setProgress] = useState(0)
  const holdInterval = useRef(null)

  const enterSite = () => setView('HOME')
  const startQuiz = () => setView('QUIZ')
  const viewProduct = (product) => { setActiveProduct(product); setView('PRODUCT') }
  const addToCart = (product) => setCart([...cart, product])
  const openCheckout = () => { if (cart.length > 0) setView('CHECKOUT') }

  const startHold = () => {
    if (holding) return
    setHolding(true)
    holdInterval.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(holdInterval.current)
          enterSite()
          return 100
        }
        return prev + 2
      })
    }, 30)
  }

  const endHold = () => {
    setHolding(false)
    clearInterval(holdInterval.current)
    setProgress(0)
  }

  // --- Quiz Component (inline) ---
  function QuizView({ onExit, onResult }) {
    const [step, setStep] = useState(0)
    const [scores, setScores] = useState({ kunduman: 0, diwata: 0, tala: 0 })

    const handleAnswer = (affinity) => {
      setScores(prev => ({ ...prev, [affinity]: (prev[affinity] || 0) + 1 }))

      if (step < QUIZ_QUESTIONS.length - 1) {
        setStep(step + 1)
      } else {
        // decide winner
        const finalScores = { ...scores, [affinity]: (scores[affinity] || 0) + 1 }
        const winnerId = Object.keys(finalScores).reduce((a, b) => finalScores[a] > finalScores[b] ? a : b)
        const winner = FRAGRANCES.find(f => f.id === winnerId) || FRAGRANCES[0]
        onResult(winner)
      }
    }

    const question = QUIZ_QUESTIONS[step]

    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#1a1a1a] text-[#f0f0f0] px-6">
        <div className="absolute top-10 right-10">
          <button onClick={onExit} className="font-mono text-xs opacity-50 hover:opacity-100">EXIT JOURNEY</button>
        </div>

        <div className="max-w-2xl w-full text-center animate-fade-in">
          <p className="font-mono text-xs text-white/30 mb-8">QUERY {step + 1} / {QUIZ_QUESTIONS.length}</p>
          <h2 className="font-serif text-3xl md:text-5xl mb-16">{question.text}</h2>

          <div className="grid gap-6">
            {question.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt.affinity)}
                className="py-6 border border-white/10 hover:border-white/40 hover:bg-white/5 transition-all duration-300 font-sans tracking-wide text-lg"
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <WispCursor />
      <NoiseOverlay />
      {view === 'PORTAL' && (
        <div className="relative w-full h-screen flex flex-col items-center justify-center bg-[#1a1a1a] text-[#f0f0f0] overflow-hidden">
          <AtmosphereCanvas theme="smoke" />
          <div className="z-10 flex flex-col items-center space-y-8">
            <h1 className="font-serif text-6xl md:text-9xl tracking-tighter opacity-90">MARAHUYO</h1>
            <p className="font-mono text-sm tracking-[0.3em] uppercase opacity-60">Scent is the memory of the soul</p>
            <div
              className="relative mt-12 group cursor-none"
              onMouseDown={startHold}
              onMouseUp={endHold}
              onTouchStart={startHold}
              onTouchEnd={endHold}
            >
              <div className="absolute inset-0 rounded-full blur-xl bg-white opacity-10 transition-opacity duration-500 group-hover:opacity-20"></div>
              <button className="relative w-24 h-24 rounded-full border border-white/20 flex items-center justify-center overflow-hidden transition-all duration-700">
                <span
                  className="absolute inset-0 bg-white mix-blend-overlay transition-all duration-100 ease-linear"
                  style={{ height: `${progress}%`, bottom: 0, top: 'auto' }}
                />
                <span className="relative z-10 font-mono text-xs">ENTER</span>
              </button>
            </div>
            <p className="text-xs text-white/30 font-mono animate-pulse">{holding ? 'Focusing...' : 'Hold to Enter'}</p>
          </div>
        </div>
      )}

      {view === 'HOME' && (
        <div className="min-h-screen bg-[#1a1a1a] text-[#f0f0f0] pb-20">
          <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-40 mix-blend-difference">
            <h2 className="font-serif text-xl tracking-widest cursor-pointer" onClick={() => setView('HOME')}>MARAHUYO</h2>
            <button onClick={openCheckout} className="flex items-center space-x-2 font-mono text-sm hover:opacity-70">
              <span>VESSEL</span>
              <span>({cart.length})</span>
            </button>
          </nav>

          <header className="relative pt-40 px-6 md:px-20 mb-32">
            <h1 className="font-serif text-5xl md:text-7xl leading-[1.1] max-w-4xl">
              <span className="block opacity-50 italic text-3xl md:text-4xl mb-4">The Collection</span>
              Fragrances forged from<br />
              shadow, memory, and<br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#d4a373] to-[#83c5be]">enchantment.</span>
            </h1>
            <div className="mt-12">
              <button onClick={startQuiz} className="group flex items-center space-x-4 border-b border-white/20 pb-2 hover:border-white transition-all">
                <span className="font-mono text-sm uppercase tracking-widest">Begin Scent Journey</span>
                <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </header>

          <section className="px-6 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-4">
            {FRAGRANCES.map((fragrance) => (
              <div key={fragrance.id} onClick={() => viewProduct(fragrance)} className="group cursor-pointer relative h-[60vh] border-l border-white/10 pl-4 md:pl-8 flex flex-col justify-end pb-10 hover:bg-white/5 transition-colors duration-500">
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-32 h-48 bg-linear-to-b from-transparent to-white/5 border border-white/10 rounded-t-full opacity-50 group-hover:opacity-80 transition-all duration-700 blur-sm group-hover:blur-none transform group-hover:-translate-y-2"></div>
                <h3 className="font-serif text-3xl mb-2 relative z-10">{fragrance.name}</h3>
                <p className="font-mono text-xs text-white/50 mb-4 tracking-widest relative z-10">{fragrance.translation}</p>
                <p className="font-sans text-sm opacity-70 max-w-xs leading-relaxed relative z-10">{fragrance.desc}</p>
              </div>
            ))}
          </section>
        </div>
      )}

      {view === 'QUIZ' && (
        <QuizView onExit={() => setView('HOME')} onResult={(winner) => viewProduct(winner)} />
      )}

      {view === 'PRODUCT' && activeProduct && (
        <div className="relative min-h-screen bg-[#1a1a1a] text-[#f0f0f0] overflow-y-auto">
          <AtmosphereCanvas theme={activeProduct.theme} />
          <button onClick={() => setView('HOME')} className="fixed top-6 right-6 z-50 p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10 hover:bg-white hover:text-black transition-all">
            <X size={20} />
          </button>

          <div className="relative z-10 min-h-screen flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 h-[50vh] md:h-screen flex items-center justify-center sticky top-0">
              <div className="relative w-40 h-64 md:w-64 md:h-96 perspective-1000 group">
                <div className="absolute inset-0 border border-white/20 bg-linear-to-br from-white/10 to-transparent backdrop-blur-sm rounded-sm shadow-2xl transform transition-transform duration-1000 group-hover:rotate-y-12">
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3/4 h-[90%] border-x border-white/5"></div>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center w-full">
                    <span className="font-serif text-xl tracking-widest opacity-80">{activeProduct.name}</span>
                  </div>
                </div>
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-20 h-12 bg-[#2a2a2a] rounded-sm border border-white/10 shadow-lg"></div>
              </div>
            </div>

            <div className="w-full md:w-1/2 min-h-screen bg-[#1a1a1a]/80 backdrop-blur-xl p-8 md:p-20 flex flex-col justify-center border-l border-white/5">
              <div className="space-y-8 max-w-lg">
                <div>
                  <h1 className="font-serif text-5xl md:text-7xl mb-2">{activeProduct.name}</h1>
                  <p className="font-mono text-sm tracking-[0.2em] text-[#d4a373]">{activeProduct.translation.toUpperCase()}</p>
                </div>

                <div className="h-px w-20 bg-white/30 my-8"></div>

                <p className="font-serif text-xl md:text-2xl italic opacity-90 leading-relaxed">"{activeProduct.poetry}"</p>

                <p className="font-sans text-sm opacity-60 leading-loose">{activeProduct.longDesc}</p>

                <div className="grid grid-cols-1 gap-4 py-8">
                  {activeProduct.notes.map((note, i) => (
                    <div key={i} className="flex items-center space-x-4 opacity-80">
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                      <span className="font-mono text-sm uppercase">{note}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-white/10">
                  <span className="font-mono text-xl">₱{activeProduct.price.toLocaleString()}</span>
                  <button onClick={() => { addToCart(activeProduct); setView('HOME') }} className="bg-white text-black px-8 py-3 font-mono text-sm uppercase hover:bg-[#d4a373] hover:text-white transition-colors">Gather</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'CHECKOUT' && (
        <div className="min-h-screen bg-[#1a1a1a] text-[#f0f0f0] flex items-center justify-center p-6">
          <div className="max-w-2xl w-full">
            <div className="flex justify-between items-center mb-12 border-b border-white/20 pb-4">
              <h2 className="font-serif text-3xl">The Ritual</h2>
              <button onClick={() => setView('HOME')} className="opacity-50 hover:opacity-100 font-mono">ABORT</button>
            </div>

            <form className="space-y-12 font-serif text-xl md:text-3xl leading-relaxed" onSubmit={(e) => { e.preventDefault(); setView('CONFIRMATION'); setCart([]) }}>
              <p>I, <input type="text" placeholder="your name" className="bg-transparent border-b border-white/30 text-[#d4a373] focus:outline-none focus:border-[#d4a373] px-2 w-48 md:w-auto text-center placeholder:opacity-30" required /> , wish to receive the enchantment.</p>
              <p>The vessel shall be delivered to the sanctuary located at <input type="text" placeholder="full address" className="bg-transparent border-b border-white/30 text-[#d4a373] focus:outline-none focus:border-[#d4a373] px-2 w-full md:w-2/3 placeholder:opacity-30 mt-4 md:mt-0" required />.</p>
              <p>I offer <span className="mx-2 text-[#d4a373]">₱{cart.reduce((s, i) => s + i.price, 0).toLocaleString()}</span> to seal this bond. My confirmation letter shall be sent to <input type="email" placeholder="email address" className="bg-transparent border-b border-white/30 text-[#d4a373] focus:outline-none focus:border-[#d4a373] px-2 w-64 placeholder:opacity-30" required />.</p>

              <div className="pt-12 flex justify-end">
                <button type="submit" className="group relative px-8 py-4 overflow-hidden bg-white text-black font-mono text-sm uppercase tracking-widest hover:text-white">
                  <span className="absolute inset-0 bg-[#1a1a1a] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></span>
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Seal The Bond</span>
                </button>
              </div>
            </form>

            <div className="mt-12 border-t border-white/10 pt-6">
              <p className="font-mono text-xs opacity-40 uppercase tracking-widest mb-4">Contents of Vessel</p>
              <div className="space-y-2">
                {cart.map((item, i) => (
                  <div key={i} className="flex justify-between font-sans text-sm opacity-70"><span>{item.name}</span><span>₱{item.price.toLocaleString()}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'CONFIRMATION' && (
        <div className="h-screen flex flex-col items-center justify-center bg-[#1a1a1a] text-[#f0f0f0] text-center p-8">
          <AtmosphereCanvas theme="fireflies" />
          <div className="z-10 max-w-xl space-y-8 animate-fade-in">
            <Sparkles className="w-12 h-12 mx-auto text-[#d4a373] opacity-80" />
            <h1 className="font-serif text-4xl md:text-6xl">The Bond is Sealed.</h1>
            <p className="font-serif text-xl italic opacity-80">"The winds will soon carry this vessel to your door.<br/>Await the storm."</p>
            <button onClick={() => setView('HOME')} className="mt-12 font-mono text-xs border-b border-transparent hover:border-white transition-all">RETURN TO THE VOID</button>
          </div>
        </div>
      )}
    </>
  )
}
