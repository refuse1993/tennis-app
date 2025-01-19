'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Player {
  id: string
  name: string  // full_name 대신 name 사용
}

interface SetScore {
  team_a: string
  team_b: string
}

export default function NewMatchPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [formData, setFormData] = useState({
    match_date: new Date().toISOString().split('T')[0],
    team_a: {
      player1_id: '',
      player2_id: ''
    },
    team_b: {
      player1_id: '',
      player2_id: ''
    },
    sets: [
      { team_a: '', team_b: '' }
    ] as SetScore[],
    match_type: 'regular' as 'regular' | 'tournament',
    notes: ''
  })

  // 선수 목록 로드
  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const { data: players, error } = await supabase
          .from('players')  // profiles 대신 player 테이블 사용
          .select('id, name')  // email 대신 name만 선택
          .order('name')
        
        if (error) throw error
        
        setPlayers(players || [])
      } catch (error) {
        console.error('선수 목록 로딩 에러:', error)
        setError('선수 목록을 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    loadPlayers()
  }, [])

  // 세트 추가
  const addSet = () => {
    if (formData.sets.length < 5) {  // 최대 5세트까지
      setFormData(prev => ({
        ...prev,
        sets: [...prev.sets, { team_a: '', team_b: '' }]
      }))
    }
  }

  // 세트 제거
  const removeSet = (index: number) => {
    if (formData.sets.length > 1) {  // 최소 1세트는 유지
      setFormData(prev => ({
        ...prev,
        sets: prev.sets.filter((_, i) => i !== index)
      }))
    }
  }

  // 선수 선택이 유효한지 확인
  const validatePlayerSelection = () => {
    const selectedPlayers = [
      formData.team_a.player1_id,
      formData.team_a.player2_id,
      formData.team_b.player1_id,
      formData.team_b.player2_id
    ]
    
    if (selectedPlayers.some(id => !id)) {
      return '모든 선수를 선택해주세요.'
    }
    
    if (new Set(selectedPlayers).size !== 4) {
      return '같은 선수를 중복 선택할 수 없습니다.'
    }
    
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
  
    try {
      // 세트 승자 계산
      const setsWonA = formData.sets.filter(set => 
        parseInt(set.team_a) > parseInt(set.team_b)
      ).length
      const setsWonB = formData.sets.filter(set => 
        parseInt(set.team_b) > parseInt(set.team_a)
      ).length
  
      const matchData = {
        match_date: formData.match_date,
        team_a_player1_id: formData.team_a.player1_id,
        team_a_player2_id: formData.team_a.player2_id,
        team_b_player1_id: formData.team_b.player1_id,
        team_b_player2_id: formData.team_b.player2_id,
        team_a_sets: formData.sets.map(set => set.team_a),
        team_b_sets: formData.sets.map(set => set.team_b),
        winner_team: setsWonA > setsWonB ? 'A' : 'B',
        match_type: formData.match_type,
        notes: formData.notes || ''
      }
  
      console.log('전송할 데이터:', {
        ...matchData,
        team_a_sets_type: typeof matchData.team_a_sets,
        team_b_sets_type: typeof matchData.team_b_sets,
        team_a_player1_id_type: typeof matchData.team_a_player1_id,
        sets_content: formData.sets
      })
  
      const { data, error: insertError } = await supabase
        .from('matches')
        .insert([matchData])
        .select()
  
      if (insertError) {
        console.error('Supabase 에러 상세:', {
          code: insertError.code,
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
          data: matchData
        })
        throw insertError
      }
  
      console.log('저장 성공:', data)
      router.push('/dashboard')
    } catch (err) {
      console.error('전체 에러:', err)
      setError('매치 저장 중 오류가 발생했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">새 매치 등록</h1>

      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 매치 날짜 */}
        <div>
          <label className="block text-sm font-medium mb-2">매치 날짜</label>
          <input
            type="date"
            required
            className="w-full p-2 border rounded"
            value={formData.match_date}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              match_date: e.target.value
            }))}
          />
        </div>

         {/* 팀 A */}
    <div className="bg-blue-50 p-4 rounded">
      <h3 className="font-medium mb-4">팀 A</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">선수 1</label>
          <select
            required
            className="w-full p-2 border rounded"
            value={formData.team_a.player1_id}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              team_a: { ...prev.team_a, player1_id: e.target.value }
            }))}
          >
            <option value="">선수 선택</option>
            {players
              .filter(p => 
                p.id !== formData.team_a.player2_id && 
                p.id !== formData.team_b.player1_id && 
                p.id !== formData.team_b.player2_id
              )
              .map(player => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">선수 2</label>
          <select
            required
            className="w-full p-2 border rounded"
            value={formData.team_a.player2_id}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              team_a: { ...prev.team_a, player2_id: e.target.value }
            }))}
          >
            <option value="">선수 선택</option>
            {players
              .filter(p => 
                p.id !== formData.team_a.player1_id && 
                p.id !== formData.team_b.player1_id && 
                p.id !== formData.team_b.player2_id
              )
              .map(player => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
          </select>
        </div>
      </div>
    </div>

    {/* 팀 B */}
    <div className="bg-red-50 p-4 rounded">
      <h3 className="font-medium mb-4">팀 B</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">선수 1</label>
          <select
            required
            className="w-full p-2 border rounded"
            value={formData.team_b.player1_id}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              team_b: { ...prev.team_b, player1_id: e.target.value }
            }))}
          >
            <option value="">선수 선택</option>
            {players
              .filter(p => 
                p.id !== formData.team_a.player1_id && 
                p.id !== formData.team_a.player2_id && 
                p.id !== formData.team_b.player2_id
              )
              .map(player => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">선수 2</label>
          <select
            required
            className="w-full p-2 border rounded"
            value={formData.team_b.player2_id}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              team_b: { ...prev.team_b, player2_id: e.target.value }
            }))}
          >
            <option value="">선수 선택</option>
            {players
              .filter(p => 
                p.id !== formData.team_a.player1_id && 
                p.id !== formData.team_a.player2_id && 
                p.id !== formData.team_b.player1_id
              )
              .map(player => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
          </select>
            </div>
          </div>
        </div>

        {/* 세트 스코어 */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">세트 스코어</h3>
            <button
              type="button"
              onClick={addSet}
              className="text-blue-600 hover:text-blue-800"
              disabled={formData.sets.length >= 5}
            >
              + 세트 추가
            </button>
          </div>
          
          {formData.sets.map((set, index) => (
            <div key={index} className="flex items-center space-x-4 mb-4">
              <span className="font-medium">세트 {index + 1}</span>
              <input
                type="number"
                required
                min="0"
                max="7"
                placeholder="팀 A"
                className="w-20 p-2 border rounded"
                value={set.team_a}
                onChange={(e) => {
                  const newSets = [...formData.sets]
                  newSets[index].team_a = e.target.value
                  setFormData(prev => ({ ...prev, sets: newSets }))
                }}
              />
              <span>vs</span>
              <input
                type="number"
                required
                min="0"
                max="7"
                placeholder="팀 B"
                className="w-20 p-2 border rounded"
                value={set.team_b}
                onChange={(e) => {
                  const newSets = [...formData.sets]
                  newSets[index].team_b = e.target.value
                  setFormData(prev => ({ ...prev, sets: newSets }))
                }}
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeSet(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  삭제
                </button>
              )}
            </div>
          ))}
        </div>

        {/* 메모 */}
        <div>
          <label className="block text-sm font-medium mb-2">메모 (선택사항)</label>
          <textarea
            className="w-full p-2 border rounded"
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              notes: e.target.value
            }))}
          />
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isSubmitting ? '저장 중...' : '매치 저장'}
          </button>
        </div>
      </form>
    </div>
  )
}