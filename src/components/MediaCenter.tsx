"use client";

import { useState } from "react";
import {
  isPublicFileUrl,
  normalizePublicFileUrl,
} from "@/lib/media/urls";

type MediaType = "image" | "document";

type MediaItem = {
  id: string;
  type: MediaType;
  fileUrl: string;
  meta: string;
  title: string;
};

type MediaTab = {
  key: string;
  label: string;
};

type MediaCenterProps = {
  items: MediaItem[];
  tabs: MediaTab[];
  typeLabels: Record<MediaType, string>;
  downloadLabel: string;
  emptyLabel: string;
};

function safeFileUrl(url: string): string | null {
  if (!isPublicFileUrl(url)) {
    return null;
  }

  try {
    return normalizePublicFileUrl(url);
  } catch {
    return null;
  }
}

export default function MediaCenter({
  items,
  tabs,
  typeLabels,
  downloadLabel,
  emptyLabel,
}: MediaCenterProps) {
  const [activeTab, setActiveTab] = useState("all");

  const visibleItems = items
    .map((item) => {
      const fileUrl = safeFileUrl(item.fileUrl);
      return fileUrl ? { ...item, fileUrl } : null;
    })
    .filter((item): item is MediaItem => item !== null)
    .filter((item) => {
      if (activeTab === "all") return true;
      if (activeTab === "images") return item.type === "image";
      if (activeTab === "documents") return item.type === "document";
      return true;
    });

  return (
    <div className="newsroom-media">
      <div className="newsroom-media-tabs" role="tablist">
        {tabs.map((tab) => (
          <button
            className={`newsroom-media-tab ${
              activeTab === tab.key ? "is-active" : ""
            }`}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.key}
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {visibleItems.length > 0 ? (
        <div className="newsroom-media-grid">
          {visibleItems.map((item) => (
            <article className="newsroom-asset" key={item.id}>
              {item.type === "image" ? (
                <div className="newsroom-asset__media">
                  <img src={item.fileUrl} alt={item.title} loading="lazy" />
                </div>
              ) : (
                <div className="newsroom-asset__doc" aria-hidden="true">
                  <span>{item.meta.split(" ")[0]}</span>
                </div>
              )}
              <div className="newsroom-asset__body">
                <span className="newsroom-asset__type">
                  {typeLabels[item.type]}
                </span>
                <h3>{item.title}</h3>
                <p className="newsroom-asset__meta">{item.meta}</p>
                <a
                  className="newsroom-asset__action"
                  href={item.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {downloadLabel}
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="newsroom-empty">{emptyLabel}</div>
      )}
    </div>
  );
}
