'use client'

import { useState, useEffect } from 'react'
import { Play, Target, Calendar, TrendingUp, Book, Settings, User, Home, Dumbbell, Apple, BarChart3, ChevronRight, Plus, Timer, Droplets, Flame, Activity, Award, Clock, CheckCircle2, Circle } from 'lucide-react'

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
    { name: 'Supino Reto', sets: 4, reps: '8-10', weight: 80, rest: 120, completed: false, rpe: 0 },
    { name: 'Supino Inclinado', sets: 4, reps: '8-10', weight: 70, rest: 120, completed: false, rpe: 0 },
    { name: 'Crucifixo', sets: 3, reps: '10-12', weight: 25, rest: 90, completed: false, rpe: 0 },
    { name: 'Paralelas', sets: 3, reps: '8-10', weight: 0, rest: 90, completed: false, rpe: 0 },
    { name: 'Tríceps Testa', sets: 3, reps: '10-12', weight: 35, rest: 90, completed: false, rpe: 0 },
    { name: 'Tríceps Corda', sets: 3, reps: '12-15', weight: 40, rest: 60, completed: false, rpe: 0 }
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

export default function FitApp() {
  const [currentScreen, setCurrentScreen] = useState('onboarding')
  const [onboardingStep, setOnboardingStep] = useState(0)
  const [isFirstTime, setIsFirstTime] = useState(true)
  const [restTimer, setRestTimer] = useState(0)
  const [isResting, setIsResting] = useState(false)
  const [workoutData, setWorkoutData] = useState(mockWorkout)

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
            <h1 className="text-3xl font-bold text-center mb-2">FitPro</h1>
            <p className="text-[#9AA8B2] text-center">Seu personal trainer digital</p>
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
                <button className="flex-1 bg-[#0B0F14] border border-[#1A1F2E] text-[#9AA8B2] py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:border-[#F97316]/50">
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
          <button className="w-full bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white py-4 rounded-2xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-[#F97316]/25">
            Finalizar Treino
          </button>
        </div>
      </div>
    </div>
  )

  // Diet Screen
  const DietScreen = () => (
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
                <ChevronRight className="w-5 h-5 text-[#9AA8B2]" />
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
    </div>
  )

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