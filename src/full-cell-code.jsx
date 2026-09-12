import React, {useMemo, useState} from 'react';
import {changedLines} from '../content/certification-cell-code.mjs';
import {CodeBlock} from './code-viewer.jsx';
import './full-cell-code.css';

// Shared by practice notes and Get Certification: one cell, one complete copy.
export function FullCellCode({original, complete = original, label = '원본 셀 전체', highlightedLine}) {
  const [view, setView] = useState('complete');
  const changed = original !== complete;
  const lines = useMemo(() => changed ? changedLines(original, complete) : {original: [], complete: []}, [original, complete]);
  return <div className="full-cell-code">
    {changed && <div className="full-cell-tabs" role="group" aria-label="셀 전체 코드 선택">
      <button type="button" aria-pressed={view === 'complete'} onClick={() => setView('complete')}>수정 후 전체</button>
      <button type="button" aria-pressed={view === 'original'} onClick={() => setView('original')}>원본 전체</button>
      <small>강조된 줄 = {view === 'complete' ? '변경·추가한 부분' : '바꾸는 부분'}</small>
    </div>}
    <CodeBlock key={view} code={view === 'complete' ? complete : original} label={changed ? (view === 'complete' ? '수정 후 셀 전체' : '원본 셀 전체') : label} changedLines={lines[view]} highlightedLine={highlightedLine}/>
  </div>;
}
