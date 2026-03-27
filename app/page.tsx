'use client'

import { useState, useEffect, useRef, ReactNode } from 'react'

// Reusable scroll-triggered animation wrapper
function AnimateOnScroll({ 
  children, 
  className = '',
  delay = 0,
  direction = 'up'
}: { 
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'fade'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  const getTransform = () => {
    switch (direction) {
      case 'up': return 'translateY(24px)'
      case 'left': return 'translateX(-24px)'
      case 'right': return 'translateX(24px)'
      case 'fade': return 'none'
      default: return 'translateY(24px)'
    }
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : getTransform(),
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

// Staggered animation for lists
function AnimateStagger({ 
  children, 
  className = '',
  baseDelay = 0,
  staggerDelay = 80
}: { 
  children: ReactNode[]
  className?: string
  baseDelay?: number
  staggerDelay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'none' : 'translateY(16px)',
            transition: `opacity 0.5s ease ${baseDelay + index * staggerDelay}ms, transform 0.5s ease ${baseDelay + index * staggerDelay}ms`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

// Counter animation hook
function useCounterAnimation(targetValue: number, isVisible: boolean, duration: number = 1500) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    const steps = 60
    const increment = (targetValue - 0) / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= targetValue) {
        setCount(targetValue)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [isVisible, targetValue, duration])

  return count
}

// Navigation Component
function Navigation() {
  const navLinks = [
    { href: '#services', label: 'Услуги' },
    { href: '#about', label: 'О нас' },
    { href: '#process', label: 'Процесс' },
    { href: '#contact', label: 'Контакты' },
  ]

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 bg-[var(--white)] transition-shadow duration-300 ${
        scrolled ? 'shadow-sm' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between">
        <a href="#">
          <img src="/logo3.png" alt="GEOKAD" className="h-12 sm:h-14 w-auto" />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-10">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollToSection(link.href)}
              className="nav-link text-[var(--ink)] text-sm font-normal"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-[var(--ink)] text-sm p-2 -mr-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
        >
          {mobileMenuOpen ? 'Закрыть' : 'Меню'}
        </button>
      </div>

      {/* Mobile Nav - Full screen overlay */}
      <div 
        className={`md:hidden fixed inset-0 top-[57px] bg-[var(--white)] transition-all duration-300 ${
          mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <nav className="px-4 sm:px-6 py-8 flex flex-col h-full">
          {navLinks.map((link, index) => (
            <button
              key={link.href}
              onClick={() => {
                scrollToSection(link.href)
                setMobileMenuOpen(false)
              }}
              className="text-left py-4 text-[var(--ink)] text-2xl sm:text-3xl font-display border-b border-[var(--line)]"
              style={{
                animation: mobileMenuOpen ? `fadeSlideIn 300ms ease ${index * 50}ms forwards` : 'none',
                opacity: 0,
              }}
            >
              {link.label}
            </button>
          ))}
          
          <div className="mt-auto pt-12 space-y-3 text-sm text-[var(--steel)]">
            <p>+7 (XXX) XXX-XX-XX</p>
            <p>support@geokad73.ru</p>
          </div>
        </nav>
      </div>

      <style jsx>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  )
}

// Hero Section with counter animation
function HeroSection() {
  const [counterStarted, setCounterStarted] = useState(false)
  const animatedNumber = useCounterAnimation(2400, counterStarted, 2000)

  useEffect(() => {
    const timer = setTimeout(() => setCounterStarted(true), 400)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative min-h-[100svh] sm:min-h-[90vh] lg:min-h-[85vh] bg-[var(--white)] pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-12 sm:pb-16 flex flex-col justify-between overflow-hidden">
      {/* Coordinate grid background */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern id="smallGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#367065" strokeWidth="0.4"/>
          </pattern>
          <pattern id="grid" width="200" height="200" patternUnits="userSpaceOnUse">
            <rect width="200" height="200" fill="url(#smallGrid)"/>
            <path d="M 200 0 L 0 0 0 200" fill="none" stroke="#367065" strokeWidth="0.8"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" opacity="0.18"/>
        {[200, 400, 600, 800, 1000, 1200].map(x =>
          [200, 400, 600, 800].map(y => (
            <g key={`${x}-${y}`}>
              <line x1={x - 6} y1={y} x2={x + 6} y2={y} stroke="#367065" strokeWidth="1" opacity="0.4"/>
              <line x1={x} y1={y - 6} x2={x} y2={y + 6} stroke="#367065" strokeWidth="1" opacity="0.4"/>
            </g>
          ))
        )}
      </svg>

      <style jsx>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroLineIn {
          from { opacity: 0; transform: scaleX(0); }
          to   { opacity: 1; transform: scaleX(1); }
        }
        .hero-h1   { animation: heroFadeUp 0.7s ease 0.05s both; }
        .hero-line { animation: heroLineIn 0.8s ease 0.2s both; transform-origin: left; }
        .hero-p    { animation: heroFadeUp 0.7s ease 0.3s both; }
        .hero-num  { animation: heroFadeUp 0.7s ease 0.15s both; }
        .hero-stats{ animation: heroFadeUp 0.7s ease 0.45s both; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-center relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 lg:gap-8 xl:gap-12">
          {/* Left Column */}
          <div className="lg:w-[60%] xl:w-[58%]">
            <h1 className="hero-h1 font-display text-[2.5rem] leading-[0.95] sm:text-5xl md:text-6xl lg:text-7xl xl:text-[96px] font-normal text-[var(--ink)]">
              <span className="block">Кадастровые</span>
              <span className="block">и инженерные</span>
              <span className="block">изыскания</span>
            </h1>

            <div className="hero-line w-full h-px bg-[var(--line)] my-6 sm:my-8" />

            <p className="hero-p text-[var(--steel)] text-sm sm:text-base leading-relaxed max-w-md lg:max-w-lg">
              Технические планы, межевание, геодезия и проектные работы по всей России
            </p>
          </div>

          {/* Right Column - Counter */}
          <div className="hero-num lg:w-[40%] xl:w-[42%] flex flex-col justify-center items-start lg:items-end mt-4 lg:mt-0">
            <div className="relative">
              <div
                className="font-display text-[64px] sm:text-[80px] md:text-[100px] lg:text-[120px] xl:text-[160px] text-[var(--concrete)] leading-none select-none tabular-nums invisible"
                aria-hidden="true"
              >
                2&nbsp;400
              </div>
              <div className="font-display text-[64px] sm:text-[80px] md:text-[100px] lg:text-[120px] xl:text-[160px] text-[var(--concrete)] leading-none select-none tabular-nums absolute inset-0">
                {animatedNumber.toLocaleString('ru-RU')}
              </div>
            </div>
            <div className="label-caps text-[var(--steel)] mt-1 sm:mt-2">
              выполненных объектов
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats Strip */}
      <div className="hero-stats max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 lg:mt-16 relative z-10">
        <div className="flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap sm:items-center gap-3 sm:gap-x-4 sm:gap-y-2 lg:gap-0 text-[11px] sm:text-[12px] lg:text-[13px] tracking-[0.1em] uppercase font-light text-[var(--steel)]">
          <span>15 лет на рынке</span>
          <span className="hidden lg:inline mx-4 xl:mx-6 text-[var(--line)]">|</span>
          <span className="hidden sm:inline lg:hidden">·</span>
          <span>Аттестованные кадастровые инженеры</span>
          <span className="hidden lg:inline mx-4 xl:mx-6 text-[var(--line)]">|</span>
          <span className="hidden sm:inline lg:hidden">·</span>
          <span>Подача документов в Росреестр</span>
        </div>
      </div>
    </section>
  )
}

// Services Section with scroll animations
function ServicesSection() {
  const [openService, setOpenService] = useState<number | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const services = [
    {
      number: '01',
      title: 'Кадастровые работы',
      subServices: 'Технический план, Межевой план, Акт обследования',
      description: 'Полный комплекс услуг по кадастровому учёту объектов недвижимости. Подготовка документов для регистрации в Росреестре, постановка на учёт зданий, сооружений, помещений и земельных участков.',
    },
    {
      number: '02',
      title: 'Инженерные изыскания',
      subServices: 'Геодезические, Геологические, Экологические',
      description: 'Комплексные исследования территории для проектирования и строительства. Определение геологических условий, экологической обстановки и топографических особенностей участка.',
    },
    {
      number: '03',
      title: 'Проектные работы',
      subServices: 'Проектная документация, Рабочая документация, Согласование',
      description: 'Разработка проектной и рабочей документации с последующим согласованием в государственных органах. Сопровождение на всех этапах проектирования.',
    },
    {
      number: '04',
      title: 'Геодезия',
      subServices: 'Исполнительные съёмки, Топографические съёмки, Вынос точек в натуру',
      description: 'Точные геодезические измерения с использованием современного оборудования. Создание топографических планов, разбивочные работы, контроль строительства.',
    },
  ]

  return (
    <section id="services" ref={sectionRef} className="py-16 sm:py-20 lg:py-24 bg-[var(--ink)] relative overflow-hidden">
      {/* Vertical Label - desktop only */}
      <div 
        className="hidden xl:block absolute left-6 2xl:left-8 top-1/2 font-display italic text-2xl 2xl:text-3xl text-[var(--white)] opacity-90"
        style={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg) translateY(50%)',
          opacity: isVisible ? 0.9 : 0,
          transition: 'opacity 0.6s ease 0.3s',
        }}
      >
        Что мы делаем
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 xl:pl-24">
        <h2 
          className="xl:hidden font-display italic text-2xl sm:text-3xl text-[var(--white)] mb-8 sm:mb-12"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'none' : 'translateY(16px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          Что мы делаем
        </h2>

        <div className="divide-y divide-white/10">
          {services.map((service, index) => (
            <div 
              key={index}
              className="service-row py-6 sm:py-8 cursor-pointer group"
              onClick={() => setOpenService(openService === index ? null : index)}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'none' : 'translateY(20px)',
                transition: `opacity 0.5s ease ${index * 100}ms, transform 0.5s ease ${index * 100}ms`,
              }}
            >
              <div className="flex items-start gap-4 sm:gap-6 md:gap-8 lg:gap-12">
                <span className="label-caps text-[var(--steel)] shrink-0 pt-1 sm:pt-2 text-[10px] sm:text-[11px]">
                  {service.number}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 sm:gap-4">
                    <div className="min-w-0">
                      <h3 className="font-display text-lg sm:text-xl md:text-2xl lg:text-[28px] text-[var(--white)] mb-1 sm:mb-2">
                        {service.title}
                      </h3>
                      <p className="text-[11px] sm:text-[12px] lg:text-[13px] text-[var(--steel)] truncate sm:whitespace-normal">
                        {service.subServices}
                      </p>
                    </div>

                    <span 
                      className={`text-[var(--accent)] text-xl sm:text-2xl transition-all duration-200 shrink-0 ${
                        openService === index 
                          ? 'opacity-100 translate-x-0 rotate-90' 
                          : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                      }`}
                    >
                      →
                    </span>
                  </div>

                  <div 
                    className={`overflow-hidden transition-all duration-300 ${
                      openService === index ? 'max-h-48 sm:max-h-40 mt-4 sm:mt-6' : 'max-h-0'
                    }`}
                  >
                    <p className="text-[var(--white)] opacity-80 text-sm sm:text-base leading-relaxed max-w-2xl">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Why Us Section with scroll animations
function WhyUsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.15 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const advantages = [
    {
      number: '01',
      title: 'Аттестованные кадастровые инженеры',
      description: 'реестр Росреестра',
    },
    {
      number: '02',
      title: 'Современное оборудование',
      description: 'GNSS, тахеометры, квадрокоптеры',
    },
    {
      number: '03',
      title: 'Сроки по договору',
      description: 'штрафные санкции за нарушение',
    },
    {
      number: '04',
      title: 'Электронная подача',
      description: 'сдача в Росреестр без вашего участия',
    },
    {
      number: '05',
      title: 'Прозрачное ценообразование',
      description: 'фиксированная смета до старта',
    },
  ]

  return (
    <section id="about" ref={sectionRef} className="py-16 sm:py-20 lg:py-24 bg-[var(--concrete)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 lg:gap-16 xl:gap-24">
          {/* Left Column */}
          <div 
            className="lg:w-[40%] xl:w-[38%]"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'none' : 'translateY(24px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
            }}
          >
            <span className="label-caps text-[var(--steel)] block mb-3 sm:mb-4">
              Почему нас выбирают
            </span>
            <p className="text-[var(--ink)] text-sm sm:text-base leading-[1.75] mt-6 sm:mt-8">
              Мы работаем с точностью швейцарских инженеров и надёжностью государственной структуры. 
              Каждый проект ведут аттестованные специалисты с многолетним опытом. 
              Современное оборудование позволяет выполнять работы любой сложности в кратчайшие сроки.
              Мы ценим ваше время и всегда укладываемся в дедлайны.
            </p>
          </div>

          {/* Right Column */}
          <div className="lg:w-[60%] xl:w-[62%]">
            {advantages.map((item, index) => (
              <div 
                key={index}
                className="border-t border-[var(--line)] py-4 sm:py-5"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'none' : 'translateX(24px)',
                  transition: `opacity 0.5s ease ${index * 80}ms, transform 0.5s ease ${index * 80}ms`,
                }}
              >
                <div className="flex gap-4 sm:gap-6">
                  <span className="label-caps text-[var(--steel)] shrink-0 text-[10px] sm:text-[11px]">
                    {item.number}
                  </span>
                  <div>
                    <h3 className="font-display text-base sm:text-lg text-[var(--ink)]">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--steel)] mt-0.5 sm:mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Process Section with animated step counters
function ProcessSection() {
  const processRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  const steps = [
    { number: 1, title: 'Заявка', description: 'Оставляете заявку на сайте или звоните нам' },
    { number: 2, title: 'Консультация', description: 'Бесплатно оцениваем задачу и называем стоимость' },
    { number: 3, title: 'Полевые работы', description: 'Специалисты выезжают на объект с оборудованием' },
    { number: 4, title: 'Передача документов', description: 'Сдаём готовые документы и регистрируем в Росреестре' },
  ]

  const counter1 = useCounterAnimation(1, isVisible, 600)
  const counter2 = useCounterAnimation(2, isVisible, 800)
  const counter3 = useCounterAnimation(3, isVisible, 1000)
  const counter4 = useCounterAnimation(4, isVisible, 1200)
  const counters = [counter1, counter2, counter3, counter4]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (processRef.current) {
      observer.observe(processRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="process" ref={processRef} className="py-16 sm:py-20 lg:py-24 bg-[var(--white)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll className="mb-10 sm:mb-12 lg:mb-16">
          <span className="label-caps text-[var(--steel)]">Как мы работаем</span>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-6 xl:gap-8 relative">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="relative"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'none' : 'translateY(24px)',
                transition: `opacity 0.5s ease ${index * 150}ms, transform 0.5s ease ${index * 150}ms`,
              }}
            >
              <div className="font-display text-[72px] sm:text-[80px] md:text-[100px] lg:text-[90px] xl:text-[120px] text-[var(--concrete)] leading-none select-none tabular-nums">
                {counters[index]}
              </div>
              
              <h3 className="font-display text-lg sm:text-xl text-[var(--ink)] -mt-4 sm:-mt-5 lg:-mt-6 relative z-10">
                {step.title}
              </h3>
              
              <p className="text-xs sm:text-sm text-[var(--steel)] mt-2 sm:mt-3 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Contact Form Section with animations
function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    description: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return
    const arr = Array.from(incoming)
    setFiles(prev => {
      const existing = prev.map(f => f.name)
      const fresh = arr.filter(f => !existing.includes(f.name))
      return [...prev, ...fresh]
    })
  }

  const removeFile = (name: string) => {
    setFiles(prev => prev.filter(f => f.name !== name))
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} КБ`
    return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.15 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Введите имя'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Введите телефон'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Введите email'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Введите корректный email'
    }
    if (!formData.service) {
      newErrors.service = 'Выберите услугу'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setIsSubmitted(true)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const services = [
    'Кадастровые работы',
    'Инженерные изыскания',
    'Проектные работы',
    'Геодезия',
    'Нужна консультация',
  ]

  if (isSubmitted) {
    return (
      <section id="contact" className="py-16 sm:py-20 lg:py-24 bg-[var(--ink)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p 
            className="font-display italic text-xl sm:text-2xl md:text-3xl text-[var(--white)]"
            style={{ animation: 'fadeSlideUp 0.6s ease forwards' }}
          >
            Заявка принята. Свяжемся с вами в ближайшее время.
          </p>
        </div>
        <style jsx>{`
          @keyframes fadeSlideUp {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </section>
    )
  }

  return (
    <section id="contact" ref={sectionRef} className="py-16 sm:py-20 lg:py-24 bg-[var(--ink)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10 sm:gap-12 lg:gap-16 xl:gap-24">
          {/* Left Column */}
          <div 
            className="lg:w-[42%] xl:w-[45%]"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'none' : 'translateY(24px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
            }}
          >
            <h2 className="font-display italic text-3xl sm:text-4xl md:text-5xl lg:text-[52px] text-[var(--white)] leading-tight">
              Оставьте заявку
            </h2>
            <p className="text-[var(--steel)] mt-4 sm:mt-6 text-sm sm:text-base">
              Ответим в течение 30 минут в рабочее время
            </p>
            
            <div className="mt-8 sm:mt-10 lg:mt-12 space-y-3 sm:space-y-4 text-sm text-[var(--steel)]">
              <p>+7 (XXX) XXX-XX-XX</p>
              <p>support@geokad73.ru</p>
            </div>
          </div>

          {/* Right Column - Form */}
          <div 
            className="lg:w-[58%] xl:w-[55%]"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'none' : 'translateY(24px)',
              transition: 'opacity 0.6s ease 0.15s, transform 0.6s ease 0.15s',
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <div>
                  <input
                    type="text"
                    placeholder="Имя"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={`editorial-input w-full text-sm sm:text-base ${errors.name ? 'border-b-[var(--accent)]' : ''}`}
                  />
                  {errors.name && <p className="text-[var(--accent)] text-xs mt-2">{errors.name}</p>}
                </div>
                
                <div>
                  <input
                    type="tel"
                    placeholder="Телефон"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className={`editorial-input w-full text-sm sm:text-base ${errors.phone ? 'border-b-[var(--accent)]' : ''}`}
                  />
                  {errors.phone && <p className="text-[var(--accent)] text-xs mt-2">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={`editorial-input w-full text-sm sm:text-base ${errors.email ? 'border-b-[var(--accent)]' : ''}`}
                  />
                  {errors.email && <p className="text-[var(--accent)] text-xs mt-2">{errors.email}</p>}
                </div>
                
                <div>
                  <select
                    value={formData.service}
                    onChange={(e) => handleChange('service', e.target.value)}
                    className={`editorial-input w-full cursor-pointer text-sm sm:text-base ${!formData.service ? 'text-[var(--steel)]' : 'text-[var(--white)]'} ${errors.service ? 'border-b-[var(--accent)]' : ''}`}
                    style={{ backgroundColor: 'transparent' }}
                  >
                    <option value="" className="bg-[var(--ink)] text-[var(--steel)]">Вид услуги</option>
                    {services.map((service) => (
                      <option key={service} value={service} className="bg-[var(--ink)] text-[var(--white)]">
                        {service}
                      </option>
                    ))}
                  </select>
                  {errors.service && <p className="text-[var(--accent)] text-xs mt-2">{errors.service}</p>}
                </div>
              </div>

              <div>
                <textarea
                  placeholder="Описание"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                  className="editorial-input w-full resize-none text-sm sm:text-base"
                />
              </div>

              {/* File upload */}
              <div>
                <div
                  className={`border border-dashed transition-colors duration-200 cursor-pointer ${
                    dragOver
                      ? 'border-[var(--accent)] bg-white/5'
                      : 'border-[var(--steel)]/40 hover:border-[var(--accent)]/60'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
                >
                  <div className="py-6 px-4 text-center">
                    <svg className="mx-auto mb-2 opacity-40" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    <p className="text-xs sm:text-sm text-[var(--steel)]">
                      Перетащите файлы или <span className="text-[var(--accent)]">выберите</span>
                    </p>
                    <p className="text-[10px] text-[var(--steel)]/60 mt-1">
                      PDF, JPG, PNG, DWG — до 20 МБ каждый
                    </p>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.dwg,.doc,.docx"
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />

                {files.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {files.map(file => (
                      <li key={file.name} className="flex items-center justify-between gap-3 py-2 border-b border-white/10">
                        <div className="flex items-center gap-2 min-w-0">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0 text-[var(--accent)]">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                          </svg>
                          <span className="text-xs text-[var(--white)] truncate">{file.name}</span>
                          <span className="text-[10px] text-[var(--steel)] shrink-0">{formatSize(file.size)}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(file.name)}
                          className="text-[var(--steel)] hover:text-[var(--white)] transition-colors shrink-0 text-lg leading-none"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-[var(--white)] py-3.5 sm:py-4 text-xs sm:text-sm font-medium uppercase tracking-[0.15em] transition-colors duration-200"
              >
                Отправить заявку
              </button>

              <p className="text-[10px] sm:text-xs text-[var(--steel)]">
                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

// Footer with scroll animation
function Footer() {
  const footerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (footerRef.current) {
      observer.observe(footerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const services = [
    'Кадастровые работы',
    'Инженерные изыскания',
    'Проектные работы',
    'Геодезия',
  ]

  return (
    <footer ref={footerRef} className="bg-[var(--ink)] border-t border-white/10 pt-12 sm:pt-14 lg:pt-16 pb-6 sm:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-8"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'none' : 'translateY(16px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          {/* Column 1 - Logo */}
          <div className="col-span-2 sm:col-span-1">
            <img src="/logo1.png" alt="GEOKAD" className="h-20 sm:h-24 w-auto" />
            <p className="font-display italic text-[12px] sm:text-[13px] text-[var(--steel)] mt-2">
              Точность. Опыт. Результат.
            </p>
          </div>

          {/* Column 2 - Services */}
          <div>
            <span className="label-caps text-[var(--steel)] mb-3 sm:mb-4 block text-[10px] sm:text-[11px]">Услуги</span>
            <ul className="space-y-2 sm:space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <a href="#services" className="text-xs sm:text-sm text-[var(--white)] opacity-80 hover:opacity-100 transition-opacity">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Contacts */}
          <div>
            <span className="label-caps text-[var(--steel)] mb-3 sm:mb-4 block text-[10px] sm:text-[11px]">Контакты</span>
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-[var(--white)] opacity-80">
              <p>+7 (XXX) XXX-XX-XX</p>
              <p>support@geokad73.ru</p>
              <p>г. Ульяновск</p>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div 
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mt-12 sm:mt-14 lg:mt-16 pt-6 sm:pt-8 border-t border-white/10"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.6s ease 0.2s',
          }}
        >
          <p className="text-[10px] sm:text-xs text-[var(--steel)]">
            © 2026 GEOKAD. Все права защищены.
          </p>
          <a href="#" className="text-[10px] sm:text-xs text-[var(--steel)] hover:text-[var(--white)] transition-colors">
            Политика конфиденциальности
          </a>
        </div>
      </div>
    </footer>
  )
}

// Main Page
export default function HomePage() {
  return (
    <main>
      <Navigation />
      <HeroSection />
      <ServicesSection />
      <WhyUsSection />
      <ProcessSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
