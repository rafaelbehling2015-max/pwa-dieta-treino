'use client'

import { useState, useEffect } from 'react'
import { Play, Target, Calendar, TrendingUp, Book, Settings, User, Home, Dumbbell, Apple, BarChart3, ChevronRight, Plus, Timer, Droplets, Flame, Activity, Award, Clock, CheckCircle2, Circle, Sparkles, X, Share2, Facebook, Twitter, Instagram, MessageCircle } from 'lucide-react'

// Mock Data
const mockUser = {
  name: 'Alex Silva',
  goal: 'Hipertrofia',
  level: 'Intermediário',
  streak: 12,
  weight: 75.2,
  targetWeight: 80,
  calories: { consumed: 1850, target: 2200 },
  macros: { protein: { consumed: 120, target: 165 }, carbs: { consumed: 180, target: 275 }, fat: { consumed: 65, target: 85 } },
  water: { consumed: 6, target: 8 },
  todayWorkout: {
    name: 'Peito e Tríceps',
    exercises: 6,
    duration: 75,
    completed: false
  }
}

const mockWorkout = {
  name: 'Peito e Tríceps',
  exercises: [
    { name: 'Supino Reto', sets: 4, reps: '8-10', weight: 80, rest: 120, completed: false, rpe: 0, videoUrl: 'https://www.youtube.com/embed/rT7DgCr-3pg' },
    { name: 'Supino Inclinado', sets: 4, reps: '8-10', weight: 70, rest: 120, completed: false, rpe: 0, videoUrl: 'https://www.youtube.com/embed/SrqOu55lrYU' },
    { name: 'Crucifixo', sets: 3, reps: '10-12', weight: 25, rest: 90, completed: false, rpe: 0, videoUrl: 'https://www.youtube.com/embed/eozdVDA78K0' },
    { name: 'Paralelas', sets: 3, reps: '8-10', weight: 0, rest: 90, completed: false, rpe: 0, videoUrl: 'https://www.youtube.com/embed/2z8JmcrW-As' },
    { name: 'Tríceps Testa', sets: 3, reps: '10-12', weight: 35, rest: 90, completed: false, rpe: 0, videoUrl: 'https://www.youtube.com/embed/d_KZxkY_0cM' },
    { name: 'Tríceps Corda', sets: 3, reps: '12-15', weight: 40, rest: 60, completed: false, rpe: 0, videoUrl: 'https://www.youtube.com/embed/kiuVA0gs3EI' }
  ]
}

const mockMeals = [
  { name: 'Café da Manhã', calories: 450, protein: 25, carbs: 45, fat: 18, completed: true },
  { name: 'Lanche da Manhã', calories: 200, protein: 20, carbs: 15, fat: 8, completed: true },
  { name: 'Almoço', calories: 650, protein: 45, carbs: 60, fat: 22, completed: true },
  { name: 'Lanche da Tarde', calories: 300, protein: 25, carbs: 20, fat: 12, completed: false },
  { name: 'Jantar', calories: 550, protein: 40, carbs: 35, fat: 20, completed: false },
  { name: 'Ceia', calories: 250, protein: 20, carbs: 15, fat: 12, completed: false }
]

// Banco de dados de sugestões de refeições por tipo
const mealSuggestionsByType: Record<string, Array<{
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  foods: string[]
}>> = {
  'Café da Manhã': [
    {
      name: 'Omelete Proteica com Aveia',
      calories: 450,
      protein: 30,
      carbs: 45,
      fat: 15,
      foods: ['3 ovos inteiros', '50g de aveia', '1 banana', 'Canela a gosto', '200ml de leite desnatado']
    },
    {
      name: 'Panqueca de Banana Fitness',
      calories: 420,
      protein: 28,
      carbs: 50,
      fat: 12,
      foods: ['2 ovos', '1 banana', '40g de aveia', 'Mel (1 colher)', 'Pasta de amendoim (1 colher)']
    },
    {
      name: 'Iogurte Grego Completo',
      calories: 380,
      protein: 32,
      carbs: 42,
      fat: 10,
      foods: ['300g de iogurte grego', 'Mix de frutas vermelhas', '40g de granola', 'Mel (1 colher)', '20g de whey protein']
    }
  ],
  'Lanche da Manhã': [
    {
      name: 'Shake Proteico Rápido',
      calories: 200,
      protein: 25,
      carbs: 15,
      fat: 6,
      foods: ['1 scoop de whey protein', '1 banana pequena', '200ml de água', 'Canela']
    },
    {
      name: 'Sanduíche Natural Light',
      calories: 220,
      protein: 18,
      carbs: 20,
      fat: 8,
      foods: ['2 fatias de pão integral', '50g de peito de peru', 'Queijo cottage', 'Alface e tomate']
    },
    {
      name: 'Mix de Frutas e Castanhas',
      calories: 180,
      protein: 8,
      carbs: 25,
      fat: 8,
      foods: ['1 maçã', '1 banana pequena', '20g de castanhas', '10g de amêndoas']
    }
  ],
  'Almoço': [
    {
      name: 'Frango Grelhado com Batata Doce',
      calories: 650,
      protein: 50,
      carbs: 65,
      fat: 15,
      foods: ['200g de peito de frango', '200g de batata doce', 'Salada verde à vontade', 'Azeite (1 colher)', 'Brócolis no vapor']
    },
    {
      name: 'Salmão com Arroz Integral',
      calories: 680,
      protein: 48,
      carbs: 60,
      fat: 22,
      foods: ['180g de salmão', '120g de arroz integral', 'Aspargos grelhados', 'Azeite (1 colher)', 'Limão']
    },
    {
      name: 'Carne Moída com Macarrão',
      calories: 620,
      protein: 52,
      carbs: 58,
      fat: 18,
      foods: ['200g de patinho moído', '100g de macarrão integral', 'Molho de tomate caseiro', 'Legumes variados', 'Queijo ralado']
    }
  ],
  'Lanche da Tarde': [
    {
      name: 'Wrap de Atum',
      calories: 300,
      protein: 28,
      carbs: 25,
      fat: 10,
      foods: ['1 lata de atum', '1 tortilha integral', 'Alface e tomate', 'Iogurte natural', 'Cenoura ralada']
    },
    {
      name: 'Tapioca Proteica',
      calories: 280,
      protein: 22,
      carbs: 30,
      fat: 8,
      foods: ['50g de tapioca', '2 ovos', '50g de queijo branco', 'Tomate', 'Orégano']
    },
    {
      name: 'Batata Doce com Frango Desfiado',
      calories: 320,
      protein: 30,
      carbs: 35,
      fat: 6,
      foods: ['150g de batata doce', '100g de frango desfiado', 'Requeijão light', 'Cebolinha']
    }
  ],
  'Jantar': [
    {
      name: 'Tilápia com Quinoa',
      calories: 550,
      protein: 45,
      carbs: 50,
      fat: 15,
      foods: ['200g de tilápia', '100g de quinoa', 'Brócolis e couve-flor', 'Azeite (1 colher)', 'Limão']
    },
    {
      name: 'Hambúrguer Caseiro Fitness',
      calories: 580,
      protein: 48,
      carbs: 45,
      fat: 18,
      foods: ['180g de carne moída magra', '1 pão integral', 'Salada completa', 'Batata rústica assada', 'Molho caseiro']
    },
    {
      name: 'Frango com Legumes Assados',
      calories: 520,
      protein: 46,
      carbs: 40,
      fat: 16,
      foods: ['180g de peito de frango', 'Mix de legumes assados', '100g de arroz integral', 'Azeite (1 colher)', 'Ervas finas']
    }
  ],
  'Ceia': [
    {
      name: 'Iogurte com Aveia',
      calories: 250,
      protein: 22,
      carbs: 25,
      fat: 8,
      foods: ['200g de iogurte grego', '30g de aveia', 'Canela', 'Mel (1 colher pequena)']
    },
    {
      name: 'Omelete Light',
      calories: 220,
      protein: 20,
      carbs: 8,
      fat: 12,
      foods: ['2 ovos', 'Claras extras', 'Tomate', 'Orégano', 'Queijo cottage']
    },
    {
      name: 'Shake Caseína',
      calories: 240,
      protein: 28,
      carbs: 15,
      fat: 6,
      foods: ['1 scoop de caseína', '150ml de leite desnatado', 'Pasta de amendoim (1 colher chá)', 'Canela']
    }
  ]
}

export default function FitApp() {
  const [currentScreen, setCurrentScreen] = useState('onboarding')
  const [onboardingStep, setOnboardingStep] = useState(0)
  const [isFirstTime, setIsFirstTime] = useState(true)
  const [restTimer, setRestTimer] = useState(0)
  const [isResting, setIsResting] = useState(false)
  const [workoutData, setWorkoutData] = useState(mockWorkout)
  const [showMealSuggestion, setShowMealSuggestion] = useState(false)
  const [suggestedMeals, setSuggestedMeals] = useState<Array<{name: string, calories: number, protein: number, carbs: number, fat: number, foods: string[]}>>([])
  const [currentMealType, setCurrentMealType] = useState('')
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [currentVideoUrl, setCurrentVideoUrl] = useState('')
  const [currentExerciseName, setCurrentExerciseName] = useState('')
  const [showShareModal, setShowShareModal] = useState(false)
  const [workoutCompleted, setWorkoutCompleted] = useState(false)

  // Onboarding state
  const [onboardingData, setOnboardingData] = useState({
    goal: '',
    level: '',
    daysPerWeek: 0,
    sessionTime: 0,
    equipment: [],
    preferences: []
  })

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('fitapp-onboarding')
    if (hasCompletedOnboarding) {
      setIsFirstTime(false)
      setCurrentScreen('dashboard')
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => prev - 1)
      }, 1000)
    } else if (restTimer === 0) {
      setIsResting(false)
    }
    return () => clearInterval(interval)
  }, [isResting, restTimer])

  const completeOnboarding = () => {
    localStorage.setItem('fitapp-onboarding', 'true')
    setIsFirstTime(false)
    setCurrentScreen('dashboard')
  }

  const startRestTimer = (seconds: number) => {
    setRestTimer(seconds)
    setIsResting(true)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const updateExercise = (index: number, field: string, value: any) => {
    const updated = { ...workoutData }
    updated.exercises[index] = { ...updated.exercises[index], [field]: value }
    setWorkoutData(updated)
  }

  const openVideoModal = (videoUrl: string, exerciseName: string) => {
    setCurrentVideoUrl(videoUrl)
    setCurrentExerciseName(exerciseName)
    setShowVideoModal(true)
  }

  const generateMealSuggestionsByType = (mealType: string) => {
    const suggestions = mealSuggestionsByType[mealType] || []
    setSuggestedMeals(suggestions)
    setCurrentMealType(mealType)
    setShowMealSuggestion(true)
  }

  const finishWorkout = () => {
    setWorkoutCompleted(true)
    setShowShareModal(true)
  }

  const shareToSocial = (platform: string) => {
    const completedExercises = workoutData.exercises.filter(ex => ex.completed).length
    const totalExercises = workoutData.exercises.length
    const totalVolume = workoutData.exercises.reduce((acc, ex) => acc + (ex.weight * ex.sets), 0)
    
    const shareText = `💪 Acabei de completar meu treino de ${workoutData.name}!\n\n✅ ${completedExercises}/${totalExercises} exercícios\n🏋️ ${totalVolume}kg de volume total\n🔥 Mais um dia de evolução!\n\n#FitCoachPro #Treino #Fitness`
    
    const encodedText = encodeURIComponent(shareText)
    
    let shareUrl = ''
    
    switch(platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodedText}`
        break
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedText}`
        break
      case 'instagram':
        // Instagram não permite compartilhamento direto via URL, então copiamos para clipboard
        navigator.clipboard.writeText(shareText)
        alert('Texto copiado! Cole no Instagram Stories ou Feed.')
        return
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
    }
  }

  const copyWorkoutSummary = () => {
    const completedExercises = workoutData.exercises.filter(ex => ex.completed).length
    const totalExercises = workoutData.exercises.length
    const totalVolume = workoutData.exercises.reduce((acc, ex) => acc + (ex.weight * ex.sets), 0)
    
    const shareText = `💪 Acabei de completar meu treino de ${workoutData.name}!\n\n✅ ${completedExercises}/${totalExercises} exercícios\n🏋️ ${totalVolume}kg de volume total\n🔥 Mais um dia de evolução!\n\n#FitCoachPro #Treino #Fitness`
    
    navigator.clipboard.writeText(shareText)
    alert('Resumo copiado para a área de transferência!')
  }

  // Onboarding Component
  const OnboardingScreen = () => {
    const steps = [
      {
        title: 'Qual seu objetivo?',
        options: ['Hipertrofia', 'Emagrecimento', 'Força', 'Resistência'],
        field: 'goal'
      },
      {
        title: 'Qual seu nível?',
        options: ['Iniciante', 'Intermediário', 'Avançado'],
        field: 'level'
      },
      {
        title: 'Quantos dias por semana?',
        options: ['3 dias', '4 dias', '5 dias', '6 dias'],
        field: 'daysPerWeek'
      },
      {
        title: 'Tempo por sessão?',
        options: ['30-45 min', '45-60 min', '60-90 min', '90+ min'],
        field: 'sessionTime'
      },
      {
        title: 'Equipamentos disponíveis?',
        options: ['Academia completa', 'Home gym', 'Peso corporal', 'Elásticos'],
        field: 'equipment',
        multiple: true
      }
    ]

    const currentStep = steps[onboardingStep]

    return (
      <div className="min-h-screen bg-[#0B0F14] text-[#E6EBF2] p-6 flex flex-col">
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-2xl flex items-center justify-center">
                <Dumbbell className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-center mb-2">FitCoach Pro</h1>
            <p className="text-[#9AA8B2] text-center">Seu personal trainer e nutricionista digital</p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between mb-4">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 mx-1 rounded-full transition-colors duration-300 ${
                    index <= onboardingStep ? 'bg-[#F97316]' : 'bg-[#11161E]'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-[#9AA8B2] text-center">
              Etapa {onboardingStep + 1} de {steps.length}
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center">{currentStep.title}</h2>
            <div className="space-y-3">
              {currentStep.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (currentStep.multiple) {
                      const current = onboardingData[currentStep.field as keyof typeof onboardingData] as string[]
                      const updated = current.includes(option)
                        ? current.filter(item => item !== option)
                        : [...current, option]
                      setOnboardingData(prev => ({ ...prev, [currentStep.field]: updated }))
                    } else {
                      setOnboardingData(prev => ({ ...prev, [currentStep.field]: option }))
                    }
                  }}
                  className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 ${
                    currentStep.multiple
                      ? (onboardingData[currentStep.field as keyof typeof onboardingData] as string[])?.includes(option)
                        ? 'border-[#F97316] bg-[#F97316]/10'
                        : 'border-[#11161E] bg-[#11161E]/50 hover:border-[#F97316]/50'
                      : onboardingData[currentStep.field as keyof typeof onboardingData] === option
                      ? 'border-[#F97316] bg-[#F97316]/10'
                      : 'border-[#11161E] bg-[#11161E]/50 hover:border-[#F97316]/50'
                  }`}
                >
                  <span className="font-medium">{option}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          {onboardingStep > 0 && (
            <button
              onClick={() => setOnboardingStep(prev => prev - 1)}
              className="flex-1 py-4 px-6 rounded-2xl border border-[#11161E] text-[#9AA8B2] font-medium transition-colors duration-200 hover:border-[#F97316]/50"
            >
              Voltar
            </button>
          )}
          <button
            onClick={() => {
              if (onboardingStep < steps.length - 1) {
                setOnboardingStep(prev => prev + 1)
              } else {
                completeOnboarding()
              }
            }}
            disabled={!onboardingData[currentStep.field as keyof typeof onboardingData] || 
              (currentStep.multiple && (onboardingData[currentStep.field as keyof typeof onboardingData] as string[]).length === 0)}
            className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white font-medium transition-all duration-200 hover:shadow-lg hover:shadow-[#F97316]/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {onboardingStep < steps.length - 1 ? 'Continuar' : 'Finalizar'}
          </button>
        </div>
      </div>
    )
  }

  // Dashboard Component
  const DashboardScreen = () => (
    <div className="min-h-screen bg-[#0B0F14] text-[#E6EBF2]">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Olá, {mockUser.name}! 👋</h1>
            <p className="text-[#9AA8B2]">Vamos treinar hoje?</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-[#11161E] px-3 py-2 rounded-xl">
              <Flame className="w-4 h-4 text-[#F97316]" />
              <span className="text-sm font-medium">{mockUser.streak}</span>
            </div>
            <button
              onClick={() => setCurrentScreen('profile')}
              className="w-10 h-10 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-xl flex items-center justify-center"
            >
              <User className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#11161E] p-4 rounded-2xl border border-[#1A1F2E]">
            <div className="flex items-center justify-between mb-2">
              <Flame className="w-5 h-5 text-[#F97316]" />
              <span className="text-xs text-[#9AA8B2]">Calorias</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold">{mockUser.calories.consumed}</span>
              <span className="text-sm text-[#9AA8B2]">/{mockUser.calories.target}</span>
            </div>
            <div className="w-full bg-[#0B0F14] rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-[#F97316] to-[#EA580C] h-2 rounded-full transition-all duration-500"
                style={{ width: `${(mockUser.calories.consumed / mockUser.calories.target) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-[#11161E] p-4 rounded-2xl border border-[#1A1F2E]">
            <div className="flex items-center justify-between mb-2">
              <Droplets className="w-5 h-5 text-blue-400" />
              <span className="text-xs text-[#9AA8B2]">Água</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold">{mockUser.water.consumed}</span>
              <span className="text-sm text-[#9AA8B2]">/{mockUser.water.target}</span>
            </div>
            <div className="flex gap-1 mt-2">
              {Array.from({ length: mockUser.water.target }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded-full ${
                    i < mockUser.water.consumed ? 'bg-blue-400' : 'bg-[#0B0F14]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Today's Workout */}
        <div className="bg-gradient-to-br from-[#F97316]/10 to-[#EA580C]/5 p-6 rounded-2xl border border-[#F97316]/20 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-[#F97316]">Treino de Hoje</h3>
              <p className="text-[#9AA8B2]">{mockUser.todayWorkout.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-[#9AA8B2]">{mockUser.todayWorkout.exercises} exercícios</p>
              <p className="text-sm text-[#9AA8B2]">{mockUser.todayWorkout.duration} min</p>
            </div>
          </div>
          <button
            onClick={() => setCurrentScreen('workout')}
            className="w-full bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-[#F97316]/25"
          >
            <Play className="w-5 h-5" />
            Iniciar Treino
          </button>
        </div>

        {/* Macros */}
        <div className="bg-[#11161E] p-6 rounded-2xl border border-[#1A1F2E] mb-6">
          <h3 className="text-lg font-bold mb-4">Macronutrientes</h3>
          <div className="space-y-4">
            {Object.entries(mockUser.macros).map(([macro, data]) => (
              <div key={macro}>
                <div className="flex justify-between mb-2">
                  <span className="capitalize text-[#9AA8B2]">{macro === 'protein' ? 'Proteína' : macro === 'carbs' ? 'Carboidratos' : 'Gordura'}</span>
                  <span className="text-sm">{data.consumed}g / {data.target}g</span>
                </div>
                <div className="w-full bg-[#0B0F14] rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      macro === 'protein' ? 'bg-green-500' : 
                      macro === 'carbs' ? 'bg-blue-500' : 'bg-yellow-500'
                    }`}
                    style={{ width: `${Math.min((data.consumed / data.target) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setCurrentScreen('diet')}
            className="bg-[#11161E] p-4 rounded-2xl border border-[#1A1F2E] flex flex-col items-center gap-2 transition-all duration-200 hover:border-[#F97316]/50"
          >
            <Apple className="w-6 h-6 text-[#F97316]" />
            <span className="text-sm font-medium">Dieta</span>
          </button>
          <button
            onClick={() => setCurrentScreen('progress')}
            className="bg-[#11161E] p-4 rounded-2xl border border-[#1A1F2E] flex flex-col items-center gap-2 transition-all duration-200 hover:border-[#F97316]/50"
          >
            <TrendingUp className="w-6 h-6 text-[#F97316]" />
            <span className="text-sm font-medium">Progresso</span>
          </button>
        </div>
      </div>
    </div>
  )

  // Workout Screen
  const WorkoutScreen = () => (
    <div className="min-h-screen bg-[#0B0F14] text-[#E6EBF2]">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentScreen('dashboard')}
            className="w-10 h-10 bg-[#11161E] rounded-xl flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <div className="text-center">
            <h1 className="text-xl font-bold">{workoutData.name}</h1>
            <p className="text-[#9AA8B2] text-sm">6 exercícios • 75 min</p>
          </div>
          <button className="w-10 h-10 bg-[#11161E] rounded-xl flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Rest Timer */}
        {isResting && (
          <div className="bg-gradient-to-br from-[#F97316]/10 to-[#EA580C]/5 p-6 rounded-2xl border border-[#F97316]/20 mb-6">
            <div className="text-center">
              <Timer className="w-8 h-8 text-[#F97316] mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-[#F97316]">{formatTime(restTimer)}</h3>
              <p className="text-[#9AA8B2]">Tempo de descanso</p>
              <button
                onClick={() => setIsResting(false)}
                className="mt-4 px-6 py-2 bg-[#F97316] text-white rounded-xl text-sm font-medium"
              >
                Pular Descanso
              </button>
            </div>
          </div>
        )}

        {/* Exercises */}
        <div className="space-y-4">
          {workoutData.exercises.map((exercise, index) => (
            <div key={index} className="bg-[#11161E] p-6 rounded-2xl border border-[#1A1F2E]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{exercise.name}</h3>
                  <p className="text-[#9AA8B2] text-sm">{exercise.sets} séries • {exercise.reps} reps</p>
                </div>
                <button
                  onClick={() => updateExercise(index, 'completed', !exercise.completed)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    exercise.completed 
                      ? 'border-[#F97316] bg-[#F97316] text-white' 
                      : 'border-[#9AA8B2] hover:border-[#F97316]'
                  }`}
                >
                  {exercise.completed && <CheckCircle2 className="w-5 h-5" />}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-xs text-[#9AA8B2] block mb-1">Carga (kg)</label>
                  <input
                    type="number"
                    value={exercise.weight}
                    onChange={(e) => updateExercise(index, 'weight', parseInt(e.target.value))}
                    className="w-full bg-[#0B0F14] border border-[#1A1F2E] rounded-xl px-3 py-2 text-center font-medium focus:border-[#F97316] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#9AA8B2] block mb-1">RPE</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={exercise.rpe || ''}
                    onChange={(e) => updateExercise(index, 'rpe', parseInt(e.target.value))}
                    className="w-full bg-[#0B0F14] border border-[#1A1F2E] rounded-xl px-3 py-2 text-center font-medium focus:border-[#F97316] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#9AA8B2] block mb-1">Descanso</label>
                  <button
                    onClick={() => startRestTimer(exercise.rest)}
                    className="w-full bg-[#F97316] text-white rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-[#EA580C]"
                  >
                    {exercise.rest}s
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => openVideoModal(exercise.videoUrl, exercise.name)}
                  className="flex-1 bg-[#0B0F14] border border-[#1A1F2E] text-[#9AA8B2] py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:border-[#F97316]/50 hover:text-[#F97316] flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Ver Vídeo
                </button>
                <button className="flex-1 bg-[#0B0F14] border border-[#1A1F2E] text-[#9AA8B2] py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:border-[#F97316]/50">
                  Histórico
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pb-6">
          <button 
            onClick={finishWorkout}
            className="w-full bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white py-4 rounded-2xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-[#F97316]/25"
          >
            Finalizar Treino
          </button>
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#11161E] rounded-3xl w-full max-w-3xl border border-[#1A1F2E] overflow-hidden">
            <div className="p-6 border-b border-[#1A1F2E] flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{currentExerciseName}</h2>
                <p className="text-[#9AA8B2] text-sm">Vídeo demonstrativo</p>
              </div>
              <button
                onClick={() => setShowVideoModal(false)}
                className="w-10 h-10 bg-[#0B0F14] rounded-xl flex items-center justify-center hover:bg-[#1A1F2E] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video bg-black">
              <iframe
                width="100%"
                height="100%"
                src={currentVideoUrl}
                title={currentExerciseName}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="p-6">
              <button
                onClick={() => setShowVideoModal(false)}
                className="w-full bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white py-3 rounded-2xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-[#F97316]/25"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#11161E] rounded-3xl w-full max-w-md border border-[#1A1F2E] overflow-hidden">
            <div className="p-6 border-b border-[#1A1F2E]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">🎉 Treino Finalizado!</h2>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="w-12 h-12 bg-[#0B0F14] rounded-xl flex items-center justify-center hover:bg-[#1A1F2E] transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-[#9AA8B2]">Parabéns! Compartilhe sua conquista com seus amigos.</p>
            </div>

            <div className="p-6">
              {/* Workout Summary */}
              <div className="bg-[#0B0F14] p-6 rounded-2xl border border-[#1A1F2E] mb-6">
                <h3 className="font-bold mb-4">{workoutData.name}</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-[#F97316]">
                      {workoutData.exercises.filter(ex => ex.completed).length}
                    </p>
                    <p className="text-xs text-[#9AA8B2]">Exercícios</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#F97316]">
                      {workoutData.exercises.reduce((acc, ex) => acc + (ex.weight * ex.sets), 0)}kg
                    </p>
                    <p className="text-xs text-[#9AA8B2]">Volume Total</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#F97316]">75</p>
                    <p className="text-xs text-[#9AA8B2]">Minutos</p>
                  </div>
                </div>
              </div>

              {/* Social Share Buttons */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => shareToSocial('whatsapp')}
                  className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-3 transition-all duration-200 hover:shadow-lg hover:shadow-[#25D366]/25"
                >
                  <MessageCircle className="w-5 h-5" />
                  Compartilhar no WhatsApp
                </button>

                <button
                  onClick={() => shareToSocial('instagram')}
                  className="w-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-3 transition-all duration-200 hover:shadow-lg"
                >
                  <Instagram className="w-5 h-5" />
                  Compartilhar no Instagram
                </button>

                <button
                  onClick={() => shareToSocial('facebook')}
                  className="w-full bg-[#1877F2] text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-3 transition-all duration-200 hover:shadow-lg hover:shadow-[#1877F2]/25"
                >
                  <Facebook className="w-5 h-5" />
                  Compartilhar no Facebook
                </button>

                <button
                  onClick={() => shareToSocial('twitter')}
                  className="w-full bg-[#1DA1F2] text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-3 transition-all duration-200 hover:shadow-lg hover:shadow-[#1DA1F2]/25"
                >
                  <Twitter className="w-5 h-5" />
                  Compartilhar no Twitter
                </button>
              </div>

              {/* Copy Summary Button */}
              <button
                onClick={copyWorkoutSummary}
                className="w-full bg-[#0B0F14] border border-[#1A1F2E] text-[#9AA8B2] py-4 rounded-2xl font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:border-[#F97316]/50"
              >
                <Share2 className="w-5 h-5" />
                Copiar Resumo
              </button>

              <button
                onClick={() => {
                  setShowShareModal(false)
                  setCurrentScreen('dashboard')
                }}
                className="w-full mt-4 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white py-4 rounded-2xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-[#F97316]/25"
              >
                Voltar ao Início
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  // Diet Screen
  const DietScreen = () => {
    const remainingCalories = mockUser.calories.target - mockUser.calories.consumed
    const remainingProtein = mockUser.macros.protein.target - mockUser.macros.protein.consumed
    const remainingCarbs = mockUser.macros.carbs.target - mockUser.macros.carbs.consumed
    const remainingFat = mockUser.macros.fat.target - mockUser.macros.fat.consumed

    return (
      <div className="min-h-screen bg-[#0B0F14] text-[#E6EBF2]">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrentScreen('dashboard')}
              className="w-10 h-10 bg-[#11161E] rounded-xl flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <h1 className="text-xl font-bold">Dieta do Dia</h1>
            <button className="w-10 h-10 bg-[#11161E] rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Daily Summary */}
          <div className="bg-[#11161E] p-6 rounded-2xl border border-[#1A1F2E] mb-6">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-[#F97316]">{mockUser.calories.consumed}</p>
                <p className="text-xs text-[#9AA8B2]">Calorias</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-500">{mockUser.macros.protein.consumed}g</p>
                <p className="text-xs text-[#9AA8B2]">Proteína</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-500">{mockUser.macros.carbs.consumed}g</p>
                <p className="text-xs text-[#9AA8B2]">Carbos</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-500">{mockUser.macros.fat.consumed}g</p>
                <p className="text-xs text-[#9AA8B2]">Gordura</p>
              </div>
            </div>
          </div>

          {/* Meals */}
          <div className="space-y-4">
            {mockMeals.map((meal, index) => (
              <div key={index} className="bg-[#11161E] p-6 rounded-2xl border border-[#1A1F2E]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <button
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        meal.completed 
                          ? 'border-[#F97316] bg-[#F97316] text-white' 
                          : 'border-[#9AA8B2] hover:border-[#F97316]'
                      }`}
                    >
                      {meal.completed && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                    <div>
                      <h3 className="font-bold">{meal.name}</h3>
                      <p className="text-[#9AA8B2] text-sm">{meal.calories} kcal</p>
                    </div>
                  </div>
                  <button
                    onClick={() => generateMealSuggestionsByType(meal.name)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-purple-600/25 flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Sugerir
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm font-medium text-green-500">{meal.protein}g</p>
                    <p className="text-xs text-[#9AA8B2]">Proteína</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-500">{meal.carbs}g</p>
                    <p className="text-xs text-[#9AA8B2]">Carbos</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-yellow-500">{meal.fat}g</p>
                    <p className="text-xs text-[#9AA8B2]">Gordura</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Water Tracking */}
          <div className="bg-[#11161E] p-6 rounded-2xl border border-[#1A1F2E] mt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold">Hidratação</h3>
              </div>
              <span className="text-sm text-[#9AA8B2]">{mockUser.water.consumed}/{mockUser.water.target} copos</span>
            </div>
            <div className="flex gap-2">
              {Array.from({ length: mockUser.water.target }).map((_, i) => (
                <button
                  key={i}
                  className={`flex-1 h-12 rounded-xl transition-all duration-200 ${
                    i < mockUser.water.consumed 
                      ? 'bg-blue-400 text-white' 
                      : 'bg-[#0B0F14] border border-[#1A1F2E] hover:border-blue-400/50'
                  }`}
                >
                  <Droplets className="w-5 h-5 mx-auto" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Meal Suggestion Modal */}
        {showMealSuggestion && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-6">
            <div className="bg-[#11161E] rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto border border-[#1A1F2E]">
              <div className="sticky top-0 bg-[#11161E] p-6 border-b border-[#1A1F2E] flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-purple-500" />
                    Sugestões para {currentMealType}
                  </h2>
                  <p className="text-[#9AA8B2] text-sm mt-1">
                    Opções personalizadas para sua refeição
                  </p>
                </div>
                <button
                  onClick={() => setShowMealSuggestion(false)}
                  className="w-10 h-10 bg-[#0B0F14] rounded-xl flex items-center justify-center hover:bg-[#1A1F2E] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {/* Suggested Meals */}
                <div className="space-y-4">
                  {suggestedMeals.map((meal, index) => (
                    <div key={index} className="bg-[#0B0F14] p-6 rounded-2xl border border-[#1A1F2E] hover:border-purple-500/50 transition-all duration-200">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold mb-1">{meal.name}</h3>
                          <p className="text-[#F97316] font-medium">{meal.calories} kcal</p>
                        </div>
                        <div className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
                          Recomendado
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                        <div>
                          <p className="text-sm font-medium text-green-500">{meal.protein}g</p>
                          <p className="text-xs text-[#9AA8B2]">Proteína</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-500">{meal.carbs}g</p>
                          <p className="text-xs text-[#9AA8B2]">Carbos</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-yellow-500">{meal.fat}g</p>
                          <p className="text-xs text-[#9AA8B2]">Gordura</p>
                        </div>
                      </div>

                      <div className="bg-[#11161E] p-4 rounded-xl">
                        <p className="text-xs text-[#9AA8B2] mb-2 font-medium">Ingredientes:</p>
                        <ul className="space-y-1">
                          {meal.foods.map((food, foodIndex) => (
                            <li key={foodIndex} className="text-sm text-[#E6EBF2] flex items-center gap-2">
                              <div className="w-1 h-1 bg-purple-500 rounded-full" />
                              {food}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-purple-600/25">
                        Adicionar à Dieta
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowMealSuggestion(false)}
                  className="w-full mt-6 bg-[#0B0F14] border border-[#1A1F2E] text-[#9AA8B2] py-4 rounded-2xl font-medium transition-all duration-200 hover:border-[#F97316]/50"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Progress Screen
  const ProgressScreen = () => (
    <div className="min-h-screen bg-[#0B0F14] text-[#E6EBF2]">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentScreen('dashboard')}
            className="w-10 h-10 bg-[#11161E] rounded-xl flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <h1 className="text-xl font-bold">Progresso</h1>
          <button className="w-10 h-10 bg-[#11161E] rounded-xl flex items-center justify-center">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Weight Progress */}
        <div className="bg-[#11161E] p-6 rounded-2xl border border-[#1A1F2E] mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Peso Corporal</h3>
            <span className="text-[#F97316] font-bold">{mockUser.weight} kg</span>
          </div>
          <div className="h-32 bg-[#0B0F14] rounded-xl p-4 flex items-end justify-between">
            {[72, 73.5, 74.2, 75.2].map((weight, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className="w-8 bg-gradient-to-t from-[#F97316] to-[#EA580C] rounded-t"
                  style={{ height: `${(weight / 80) * 100}%` }}
                />
                <span className="text-xs text-[#9AA8B2] mt-2">{weight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Body Measurements */}
        <div className="bg-[#11161E] p-6 rounded-2xl border border-[#1A1F2E] mb-6">
          <h3 className="font-bold mb-4">Medidas Corporais</h3>
          <div className="space-y-3">
            {[
              { name: 'Peito', value: '102 cm', change: '+2 cm' },
              { name: 'Braço', value: '38 cm', change: '+1 cm' },
              { name: 'Cintura', value: '82 cm', change: '-1 cm' },
              { name: 'Coxa', value: '58 cm', change: '+1 cm' }
            ].map((measurement, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-[#9AA8B2]">{measurement.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{measurement.value}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    measurement.change.startsWith('+') 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {measurement.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workout Volume */}
        <div className="bg-[#11161E] p-6 rounded-2xl border border-[#1A1F2E] mb-6">
          <h3 className="font-bold mb-4">Volume de Treino</h3>
          <div className="h-32 bg-[#0B0F14] rounded-xl p-4 flex items-end justify-between">
            {[8500, 9200, 8800, 9600].map((volume, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className="w-8 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                  style={{ height: `${(volume / 10000) * 100}%` }}
                />
                <span className="text-xs text-[#9AA8B2] mt-2">{(volume/1000).toFixed(1)}k</span>
              </div>
            ))}
          </div>
        </div>

        {/* Photo Timeline */}
        <div className="bg-[#11161E] p-6 rounded-2xl border border-[#1A1F2E]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Linha do Tempo</h3>
            <button className="text-[#F97316] text-sm font-medium">Ver Todas</button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="aspect-square bg-[#0B0F14] rounded-xl border border-[#1A1F2E] flex items-center justify-center">
                <User className="w-8 h-8 text-[#9AA8B2]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // Profile Screen
  const ProfileScreen = () => (
    <div className="min-h-screen bg-[#0B0F14] text-[#E6EBF2]">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentScreen('dashboard')}
            className="w-10 h-10 bg-[#11161E] rounded-xl flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <h1 className="text-xl font-bold">Perfil</h1>
          <button className="w-10 h-10 bg-[#11161E] rounded-xl flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Header */}
        <div className="bg-[#11161E] p-6 rounded-2xl border border-[#1A1F2E] mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-2xl flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{mockUser.name}</h2>
              <p className="text-[#9AA8B2]">{mockUser.goal} • {mockUser.level}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-[#F97316]">{mockUser.streak}</p>
              <p className="text-xs text-[#9AA8B2]">Dias seguidos</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{mockUser.weight}</p>
              <p className="text-xs text-[#9AA8B2]">Peso atual</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{mockUser.targetWeight}</p>
              <p className="text-xs text-[#9AA8B2]">Meta</p>
            </div>
          </div>
        </div>

        {/* Menu Options */}
        <div className="space-y-3">
          {[
            { icon: Target, label: 'Meus Objetivos', screen: 'goals' },
            { icon: Calendar, label: 'Plano de Treino', screen: 'plan' },
            { icon: Book, label: 'Biblioteca', screen: 'library' },
            { icon: Activity, label: 'Estatísticas', screen: 'stats' },
            { icon: Settings, label: 'Configurações', screen: 'settings' }
          ].map((item, index) => (
            <button
              key={index}
              onClick={() => setCurrentScreen(item.screen)}
              className="w-full bg-[#11161E] p-4 rounded-2xl border border-[#1A1F2E] flex items-center justify-between transition-all duration-200 hover:border-[#F97316]/50"
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-[#F97316]" />
                <span className="font-medium">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#9AA8B2]" />
            </button>
          ))}
        </div>

        <div className="mt-8">
          <button
            onClick={() => {
              localStorage.removeItem('fitapp-onboarding')
              setCurrentScreen('onboarding')
              setOnboardingStep(0)
            }}
            className="w-full bg-red-500/10 border border-red-500/20 text-red-400 py-4 rounded-2xl font-medium transition-all duration-200 hover:bg-red-500/20"
          >
            Refazer Configuração Inicial
          </button>
        </div>
      </div>
    </div>
  )

  // Bottom Navigation
  const BottomNav = () => {
    if (currentScreen === 'onboarding') return null

    const navItems = [
      { icon: Home, label: 'Início', screen: 'dashboard' },
      { icon: Dumbbell, label: 'Treino', screen: 'workout' },
      { icon: Apple, label: 'Dieta', screen: 'diet' },
      { icon: BarChart3, label: 'Progresso', screen: 'progress' },
      { icon: User, label: 'Perfil', screen: 'profile' }
    ]

    return (
      <div className="fixed bottom-0 left-0 right-0 bg-[#11161E] border-t border-[#1A1F2E] px-6 py-4">
        <div className="flex justify-between">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => setCurrentScreen(item.screen)}
              className={`flex flex-col items-center gap-1 transition-all duration-200 ${
                currentScreen === item.screen 
                  ? 'text-[#F97316]' 
                  : 'text-[#9AA8B2] hover:text-[#F97316]'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Render current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return <OnboardingScreen />
      case 'dashboard':
        return <DashboardScreen />
      case 'workout':
        return <WorkoutScreen />
      case 'diet':
        return <DietScreen />
      case 'progress':
        return <ProgressScreen />
      case 'profile':
        return <ProfileScreen />
      default:
        return <DashboardScreen />
    }
  }

  return (
    <div className="font-inter">
      {renderScreen()}
      <BottomNav />
      {currentScreen !== 'onboarding' && <div className="h-20" />}
    </div>
  )
}
