'use client'

import React, { useState } from 'react'
import { ChevronDown, Globe, Check, AlertCircle, ArrowRight, Search } from 'lucide-react'

const content = {
  TR: {
    title: "Haber Doğrulama Asistanı",
    description: "Yapay zeka destekli, güvenilir bilgi analizi platformu",
    status: "Sistem Durumu",
    active: "Aktif ve Operasyonel",
    howToUse: "Kullanım Kılavuzu",
    steps: [
      "Telegram'da @FakeNewsCheck_Bot'u ekleyin",
      "'/start' komutu ile asistanı başlatın",
      "Analiz edilecek haberi gönderin",
      "AI destekli detaylı analizi bekleyin",
      "Sonuçları değerlendirin ve bilgiyi doğrulayın"
    ],
    supportedLanguages: "Desteklenen Diller",
    languages: ["Türkçe", "Azərbaycanca", "Русский"],
    startNow: "Hemen Başlayın"
  },
  AZ: {
    title: "Xəbər Doğrulama Köməkçisi",
    description: "Süni intellekt dəstəkli etibarlı məlumat analizi platforması",
    status: "Sistem Statusu",
    active: "Aktiv və Əməliyyat",
    howToUse: "İstifadə Təlimatı",
    steps: [
      "Telegram'da @FakeNewsCheck_Bot'u əlavə edin",
      "'/start' əmri ilə köməkçini başladın",
      "Analiz ediləcək xəbəri göndərin",
      "AI dəstəkli ətraflı analizi gözləyin",
      "Nəticələri qiymətləndirin və məlumatı doğrulayın"
    ],
    supportedLanguages: "Dəstəklənən Dillər",
    languages: ["Türkçe", "Azərbaycanca", "Русский"],
    startNow: "İndi Başlayın"
  },
  RU: {
    title: "Ассистент Проверки Новостей",
    description: "Платформа надежного анализа информации с поддержкой искусственного интеллекта",
    status: "Статус Системы",
    active: "Активен и Функционирует",
    howToUse: "Инструкция по Использованию",
    steps: [
      "Добавьте @FakeNewsCheck_Bot в Telegram",
      "Запустите ассистента командой '/start'",
      "Отправьте новость для анализа",
      "Дождитесь детального AI-анализа",
      "Оцените результаты и проверьте информацию"
    ],
    supportedLanguages: "Поддерживаемые Языки",
    languages: ["Türkçe", "Azərbaycanca", "Русский"],
    startNow: "Начать Сейчас"
  }
}

export default function Home() {
  const [language, setLanguage] = useState('TR')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const t = content[language as keyof typeof content]

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      <header className="bg-[#232323] border-b border-[#006039]/20 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Search className="w-6 h-6 text-[#006039]" />
            <h1 className="text-white text-lg md:text-xl font-bold tracking-tight">
              {t.title}
            </h1>
          </div>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 bg-[#006039] hover:bg-[#007044] text-white px-3 py-1 rounded-lg transition-colors text-sm"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">{t.languages[["TR", "AZ", "RU"].indexOf(language)]}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#232323] border border-[#006039]/20 rounded-lg shadow-xl">
                {["TR", "AZ", "RU"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang)
                      setDropdownOpen(false)
                    }}
                    className="flex items-center justify-between w-full px-4 py-3 text-left text-white hover:bg-[#006039] transition-colors"
                  >
                    {content[lang as keyof typeof content].languages[["TR", "AZ", "RU"].indexOf(lang)]}
                    {language === lang && <Check className="w-4 h-4 text-[#006039]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#232323] rounded-xl overflow-hidden border border-[#006039]/20">
            <div className="px-6 py-8 bg-[#006039]">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{t.title}</h2>
              <p className="text-white/90 text-base md:text-lg">{t.description}</p>
            </div>

            <div className="p-6 space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-[#006039]" />
                  <h3 className="text-xl font-semibold text-white">{t.status}</h3>
                </div>
                <div className="bg-[#006039]/10 border-l-4 border-[#006039] rounded-r-lg px-4 py-3">
                  <p className="text-white font-medium text-sm">{t.active}</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">{t.howToUse}</h3>
                <div className="space-y-3">
                  {t.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#006039] text-white flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <p className="text-white/90 text-sm md:text-base">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">{t.supportedLanguages}</h3>
                <div className="flex flex-wrap gap-2">
                  {t.languages.map((lang, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-white border border-[#006039] bg-[#006039]/10 text-sm"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://t.me/FakeNewsCheck_Bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#006039] hover:bg-[#007044] text-white px-6 py-3 rounded-lg transition-colors text-base font-semibold"
                >
                  {t.startNow}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

