'use client';

import { BookmarkCheck } from 'lucide-react';
import WelfareCard from '@/components/WelfareCard';
import type { WelfareItem } from '@/types/welfare';
import { SavedWrapper, SavedHeader, SavedStack } from './SavedSection.style';

interface Props {
  bookmarks: WelfareItem[];
  onToggle: (item: WelfareItem) => void;
  onClear: () => void;
}

export default function SavedSection({ bookmarks, onToggle, onClear }: Props) {
  if (bookmarks.length === 0) return null;

  const handleClear = () => {
    if (confirm(`저장한 복지 ${bookmarks.length}건을 모두 비울까요?`)) {
      onClear();
    }
  };

  return (
    <SavedWrapper id="saved-section">
      <SavedHeader>
        <div className="header_left">
          <BookmarkCheck size={22} />
          <h2>저장한 복지</h2>
          <span className="count">{bookmarks.length}</span>
        </div>
        <button type="button" className="clear_btn" onClick={handleClear}>
          전체 비우기
        </button>
      </SavedHeader>

      <SavedStack>
        {bookmarks.map((item) => (
          <WelfareCard
            key={item.id}
            welfare={item}
            isSaved
            onSave={() => onToggle(item)}
          />
        ))}
      </SavedStack>
    </SavedWrapper>
  );
}
