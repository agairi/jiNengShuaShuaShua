import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlay?: boolean;
  className?: string;
}

/**
 * 统一模态框组件
 * - 始终居中、避免穿模
 * - ESC 关闭
 * - 锁定 body 滚动
 * - 聚焦管理
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlay = true,
  className = '',
}) => {
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // 聚焦到内容区
    setTimeout(() => contentRef.current?.focus(), 0);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClass = `modal-size-${size}`;

  return (
    <div
      className="modal-overlay"
      onClick={() => closeOnOverlay && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={contentRef}
        tabIndex={-1}
        className={`modal-content ${sizeClass} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="modal-header">
            <div className="modal-title">{title}</div>
            <button
              className="modal-close-btn"
              onClick={onClose}
              aria-label="关闭"
              type="button"
            >
              <X size={20} />
            </button>
          </div>
        )}
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
