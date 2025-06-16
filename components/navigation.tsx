"use client"

import React, { useState, useRef } from "react"
import { Plus, MoreHorizontal, Copy, Edit3, Trash2, FileText, Info, CheckCircle, Flag, Files } from "lucide-react"
import { cn } from "@/lib/utils"

interface Page {
  id: string
  name: string
  icon: React.ReactNode
  type: "info" | "details" | "other" | "ending"
  disabled?: boolean
}

const getPageIcon = (type: string) => {
  switch (type) {
    case "info":
      return <Info className="w-4 h-4" />
    case "details":
      return <FileText className="w-4 h-4" />
    case "other":
      return <FileText className="w-4 h-4" />
    case "ending":
      return <CheckCircle className="w-4 h-4" />
    default:
      return <FileText className="w-4 h-4" />
  }
}

export default function Navigation() {
  const [pages, setPages] = useState<Page[]>([
    { id: "1", name: "Info", icon: getPageIcon("info"), type: "info" },
    { id: "2", name: "Details", icon: getPageIcon("details"), type: "details" },
    { id: "3", name: "Other", icon: getPageIcon("other"), type: "other" },
    { id: "4", name: "Ending", icon: getPageIcon("ending"), type: "ending" },
  ])

  const [activePage, setActivePage] = useState("2")
  const [focusedPage, setFocusedPage] = useState<string | null>(null)
  const [hoveredPage, setHoveredPage] = useState<string | null>(null)
  const [draggedPage, setDraggedPage] = useState<string | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [contextMenu, setContextMenu] = useState<{ pageId: string; x: number; y: number } | null>(null)
  const [hoveredAddIndex, setHoveredAddIndex] = useState<number | null>(null)

  const dragCounter = useRef(0)

  const handleDragStart = (e: React.DragEvent, pageId: string) => {
    setDraggedPage(pageId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverIndex(index)
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    dragCounter.current++
  }

  const handleDragLeave = (e: React.DragEvent) => {
    dragCounter.current--
    if (dragCounter.current === 0) {
      setDragOverIndex(null)
    }
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    dragCounter.current = 0

    if (!draggedPage) return

    const draggedIndex = pages.findIndex((p) => p.id === draggedPage)
    if (draggedIndex === -1) return

    const newPages = [...pages]
    const [draggedItem] = newPages.splice(draggedIndex, 1)
    newPages.splice(dropIndex, 0, draggedItem)

    setPages(newPages)
    setDraggedPage(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedPage(null)
    setDragOverIndex(null)
    dragCounter.current = 0
  }

  const addPage = (index: number) => {
    const newPage: Page = {
      id: Date.now().toString(),
      name: `New Page ${pages.length - 3}`,
      icon: getPageIcon("other"),
      type: "other",
    }

    const newPages = [...pages]
    newPages.splice(index, 0, newPage)
    setPages(newPages)
    setActivePage(newPage.id)
  }

  const addPageAtEnd = () => {
    const newPage: Page = {
      id: Date.now().toString(),
      name: `New Page ${pages.length - 3}`,
      icon: getPageIcon("other"),
      type: "other",
    }

    setPages([...pages, newPage])
    setActivePage(newPage.id)
  }

  const handleContextMenu = (e: React.MouseEvent, pageId: string) => {
    e.preventDefault()
    setContextMenu({ pageId, x: e.clientX, y: e.clientY })
  }

  const closeContextMenu = () => {
    setContextMenu(null)
  }

  const handleContextAction = (action: string, pageId: string) => {
    console.log(`${action} page:`, pageId)

    if (action === "setAsFirst") {
      const pageIndex = pages.findIndex((p) => p.id === pageId)
      if (pageIndex > 0) {
        const newPages = [...pages]
        const [page] = newPages.splice(pageIndex, 1)
        newPages.unshift(page)
        setPages(newPages)
      }
    }

    closeContextMenu()
  }

  const getPageStateStyles = (page: Page) => {
    const isActive = activePage === page.id
    const isFocused = focusedPage === page.id
    const isHovered = hoveredPage === page.id
    const isDragged = draggedPage === page.id
    const isDisabled = page.disabled

    if (isDisabled) {
      return "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60"
    }

    if (isActive || isFocused) {
      return "bg-orange-100 border-orange-300 text-orange-800 shadow-sm"
    }

    if (isHovered && !isDragged) {
      return "bg-gray-200 border-gray-300 text-gray-700"
    }

    return "bg-gray-100 border-gray-200 text-gray-600"
  }

  React.useEffect(() => {
    const handleClickOutside = () => closeContextMenu()
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-8">
      <div className="bg-white rounded-lg shadow-sm border p-6  w-full">
        <h2 className="text-lg font-semibold mb-6 text-gray-900">Form Builder Navigation</h2>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {pages.map((page, index) => (
            <React.Fragment key={page.id}>
              {/* Add button between pages */}
              {index > 0 && (
                <div
                  className="relative flex items-center group/add"
                  onMouseEnter={() => setHoveredAddIndex(index)}
                  onMouseLeave={() => setHoveredAddIndex(null)}
                >
                  {/* Dotted line connector */}
                  <div className="flex items-center mx-3">
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    </div>
                  </div>

                  {/* Add button that appears on hover */}
                  <button
                    onClick={() => addPage(index)}
                    className={cn(
                      "absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg z-10",
                      hoveredAddIndex === index ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none",
                    )}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Page item */}
              <div
                draggable={!page.disabled}
                onDragStart={(e) => handleDragStart(e, page.id)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                onContextMenu={(e) => handleContextMenu(e, page.id)}
                onClick={() => !page.disabled && setActivePage(page.id)}
                onMouseEnter={() => setHoveredPage(page.id)}
                onMouseLeave={() => setHoveredPage(null)}
                onFocus={() => setFocusedPage(page.id)}
                onBlur={() => setFocusedPage(null)}
                tabIndex={page.disabled ? -1 : 0}
                className={cn(
                  "relative flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all duration-200 select-none group min-w-fit focus:outline-none",
                  getPageStateStyles(page),
                  draggedPage === page.id && "opacity-50",
                  dragOverIndex === index && draggedPage !== page.id && "ring-2 ring-blue-300 ring-offset-2",
                )}
              >
                <div className="w-5 h-5 flex items-center justify-center">{page.icon}</div>
                <span className="text-sm font-medium whitespace-nowrap">{page.name}</span>

                {/* Context menu trigger */}
                {!page.disabled && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleContextMenu(e, page.id)
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-black/10 rounded transition-all duration-200"
                  >
                    <MoreHorizontal className="w-3 h-3" />
                  </button>
                )}
              </div>
            </React.Fragment>
          ))}

          {/* Final dotted line and add page button */}
          <div className="flex items-center gap-2">
            <div className="flex items-center mx-3">
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              </div>
            </div>

            <button
              onClick={addPageAtEnd}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg border border-dashed border-gray-300 hover:border-gray-400 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Add page
            </button>
          </div>
        </div>

        {/* Context Menu - Settings Style */}
        {contextMenu && (
          <div
            className="fixed bg-white rounded-lg shadow-xl border py-2 z-50 min-w-[180px]"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <div className="px-3 py-2 text-sm font-semibold text-gray-900 border-b border-gray-100">Settings</div>

            <button
              onClick={() => handleContextAction("setAsFirst", contextMenu.pageId)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-gray-700"
            >
              <Flag className="w-4 h-4 text-blue-500" />
              Set as first page
            </button>

            <button
              onClick={() => handleContextAction("rename", contextMenu.pageId)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-gray-700"
            >
              <Edit3 className="w-4 h-4 text-gray-500" />
              Rename
            </button>

            <button
              onClick={() => handleContextAction("copy", contextMenu.pageId)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-gray-700"
            >
              <Copy className="w-4 h-4 text-gray-500" />
              Copy
            </button>

            <button
              onClick={() => handleContextAction("duplicate", contextMenu.pageId)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-gray-700"
            >
              <Files className="w-4 h-4 text-gray-500" />
              Duplicate
            </button>

            <button
              onClick={() => handleContextAction("delete", contextMenu.pageId)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-red-600"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
