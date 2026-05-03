import { useEffect, useRef } from 'react';
import { FeatureList } from './FeatureList.jsx';

function DetailList({ items }) {
  return (
    <div className="detail-list">
      {items.map((item) => (
        <article className="detail-item" key={item.title}>
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </article>
      ))}
    </div>
  );
}

function PracticeContent({ practice }) {
  if (Array.isArray(practice)) {
    return (
      <ol className="practice-list">
        {practice.map((item) => (
          <li key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </li>
        ))}
      </ol>
    );
  }

  return <p className="lead">{practice}</p>;
}

function PracticeEditor({ draft, onDraftChange }) {
  const editorRef = useRef(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (editor && editor.textContent !== draft) {
      editor.textContent = draft;
    }
  }, [draft]);

  const getSelectionOffsets = (editor) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !editor.contains(selection.anchorNode)) {
      return null;
    }

    const range = selection.getRangeAt(0);
    const startRange = range.cloneRange();
    startRange.selectNodeContents(editor);
    startRange.setEnd(range.startContainer, range.startOffset);

    const endRange = range.cloneRange();
    endRange.selectNodeContents(editor);
    endRange.setEnd(range.endContainer, range.endOffset);

    return {
      start: startRange.toString().length,
      end: endRange.toString().length
    };
  };

  const setSelectionOffsets = (editor, start, end = start) => {
    const selection = window.getSelection();
    const range = document.createRange();
    const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);
    let currentOffset = 0;
    let startSet = false;
    let endSet = false;
    let node = walker.nextNode();

    while (node) {
      const nextOffset = currentOffset + node.textContent.length;

      if (!startSet && start <= nextOffset) {
        range.setStart(node, Math.max(0, start - currentOffset));
        startSet = true;
      }

      if (!endSet && end <= nextOffset) {
        range.setEnd(node, Math.max(0, end - currentOffset));
        endSet = true;
        break;
      }

      currentOffset = nextOffset;
      node = walker.nextNode();
    }

    if (!startSet || !endSet) {
      editor.focus();
      range.selectNodeContents(editor);
      range.collapse(false);
    }

    selection.removeAllRanges();
    selection.addRange(range);
  };

  const updateDraftWithSelection = (editor, nextValue, nextStart, nextEnd = nextStart) => {
    editor.textContent = nextValue;
    onDraftChange(nextValue);

    requestAnimationFrame(() => {
      setSelectionOffsets(editor, nextStart, nextEnd);
    });
  };

  const handleKeyDown = (event) => {
    if (event.key !== 'Tab') {
      return;
    }

    event.preventDefault();

    const editor = event.currentTarget;
    const selectionOffsets = getSelectionOffsets(editor);
    if (!selectionOffsets) {
      return;
    }

    const { start: selectionStart, end: selectionEnd } = selectionOffsets;
    const value = editor.textContent;
    const indent = '  ';

    if (selectionStart === selectionEnd) {
      if (event.shiftKey) {
        const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
        const linePrefix = value.slice(lineStart, selectionStart);

        if (linePrefix.startsWith(indent)) {
          const nextValue = value.slice(0, lineStart) + value.slice(lineStart + indent.length);
          const nextPosition = Math.max(lineStart, selectionStart - indent.length);
          updateDraftWithSelection(editor, nextValue, nextPosition);
        }
      } else {
        const nextValue = value.slice(0, selectionStart) + indent + value.slice(selectionEnd);
        const nextPosition = selectionStart + indent.length;
        updateDraftWithSelection(editor, nextValue, nextPosition);
      }

      return;
    }

    const blockStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
    const blockEnd = value.indexOf('\n', selectionEnd);
    const normalizedBlockEnd = blockEnd === -1 ? value.length : blockEnd;
    const selectedBlock = value.slice(blockStart, normalizedBlockEnd);

    if (event.shiftKey) {
      const lines = selectedBlock.split('\n');
      let totalRemoved = 0;
      let removedBeforeSelection = 0;
      let cursor = blockStart;
      const nextBlock = lines
        .map((line) => {
          const removedFromLine = line.startsWith(indent) ? indent.length : 0;
          if (cursor < selectionStart) {
            removedBeforeSelection += Math.min(removedFromLine, selectionStart - cursor);
          }

          cursor += line.length + 1;

          if (line.startsWith(indent)) {
            totalRemoved += indent.length;
            return line.slice(indent.length);
          }

          return line;
        })
        .join('\n');

      const nextValue = value.slice(0, blockStart) + nextBlock + value.slice(normalizedBlockEnd);
      updateDraftWithSelection(
        editor,
        nextValue,
        Math.max(blockStart, selectionStart - removedBeforeSelection),
        Math.max(blockStart, selectionEnd - totalRemoved)
      );
      return;
    }

    const nextBlock = selectedBlock
      .split('\n')
      .map((line) => indent + line)
      .join('\n');
    const lineCount = selectedBlock.split('\n').length;
    const nextValue = value.slice(0, blockStart) + nextBlock + value.slice(normalizedBlockEnd);
    updateDraftWithSelection(
      editor,
      nextValue,
      selectionStart + indent.length,
      selectionEnd + lineCount * indent.length
    );
  };

  return (
    <article className="panel wide">
      <div className="section-title">
        <span>Code</span>
        <h2>代码草稿</h2>
      </div>
      <div
        className="practice-editor"
        contentEditable="plaintext-only"
        data-1p-ignore="true"
        data-placeholder="在这里写代码草稿。这个编辑区只保存内容，不执行代码。"
        data-form-type="other"
        data-lpignore="true"
        onInput={(event) => onDraftChange(event.currentTarget.textContent)}
        onKeyDown={handleKeyDown}
        ref={editorRef}
        role="textbox"
        spellCheck="false"
        suppressContentEditableWarning
        tabIndex={0}
      />
    </article>
  );
}

export function LessonContent({
  isDone,
  lesson,
  onDone,
  onPracticeDraftChange,
  practiceDraft,
  tab
}) {
  if (tab === 'practice') {
    return (
      <section className="content-grid">
        <article className="panel wide">
          <div className="section-title">
            <span>Practice</span>
            <h2>练习</h2>
          </div>
          <PracticeContent practice={lesson.practice} />
        </article>
        <PracticeEditor draft={practiceDraft} onDraftChange={onPracticeDraftChange} />
      </section>
    );
  }

  if (tab === 'review') {
    return (
      <section className="content-grid">
        <article className="panel wide">
          <div className="section-title">
            <span>Review</span>
            <h2>复盘</h2>
          </div>
          <ul className="checklist">
            {lesson.checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <button className={isDone ? 'primary done' : 'primary'} onClick={onDone} type="button">
            {isDone ? '已完成' : '标记为已完成'}
          </button>
        </article>
      </section>
    );
  }

  return (
    <section className="content-grid">
      <article className="panel wide">
        <div className="section-title">
          <span>Why</span>
          <h2>这个版本解决了什么</h2>
        </div>
        <p className="lead">{lesson.whyItMatters}</p>
      </article>

      <article className="panel wide">
        <div className="section-title">
          <span>Features</span>
          <h2>方法与特性</h2>
        </div>
        <FeatureList features={lesson.features} />
      </article>

      <article className="panel wide">
        <div className="section-title">
          <span>Deep Dive</span>
          <h2>深入理解</h2>
        </div>
        <DetailList items={lesson.deepDive} />
      </article>

      <article className="panel wide">
        <div className="section-title">
          <span>Code</span>
          <h2>代码示例</h2>
        </div>
        <pre className="code-block">
          <code>{lesson.code}</code>
        </pre>
      </article>
    </section>
  );
}
