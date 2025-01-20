'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

interface AvatarUploadProps {
  userId: string
  avatarUrl: string | null
  onUploadComplete: (url: string) => void
}

export default function AvatarUpload({ userId, avatarUrl, onUploadComplete }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false)

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('이미지를 선택해주세요.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${userId}/avatar.${fileExt}`

      // Storage에 이미지 업로드
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      // 공개 URL 가져오기
      const { data: publicUrl } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // players 테이블 업데이트
      const { error: updateError } = await supabase
        .from('players')
        .update({ avatar_url: publicUrl.publicUrl })
        .eq('id', userId)

      if (updateError) throw updateError

      onUploadComplete(publicUrl.publicUrl)
      alert('프로필 이미지가 성공적으로 변경되었습니다.')

    } catch (error) {
      alert('이미지 업로드 중 오류가 발생했습니다.')
      console.error('Error uploading avatar:', error)
    } finally {
      setUploading(false)
    }
  }

  const removeAvatar = async () => {
    try {
      await supabase
        .from('players')
        .update({ avatar_url: null })
        .eq('id', userId)
      onUploadComplete('')
      alert('프로필 이미지가 제거되었습니다.')
    } catch (error) {
      alert('프로필 이미지 제거 중 오류가 발생했습니다.')
      console.error('Error removing avatar:', error)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="Profile"
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl font-bold">
            {userId[0]?.toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          className="px-4 py-2 border rounded text-sm bg-white hover:bg-gray-100"
          disabled={uploading}
          onClick={() => document.getElementById('avatar-upload')?.click()}
        >
          {uploading ? '업로드 중...' : '이미지 변경'}
        </button>
        {avatarUrl && (
          <button
            className="px-4 py-2 border rounded text-sm bg-red-500 text-white hover:bg-red-600"
            disabled={uploading}
            onClick={removeAvatar}
          >
            제거
          </button>
        )}
      </div>
      <input
        type="file"
        id="avatar-upload"
        className="hidden"
        accept="image/*"
        onChange={uploadAvatar}
        disabled={uploading}
      />
    </div>
  )
}