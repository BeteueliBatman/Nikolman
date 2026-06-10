"use client";

import type { CSSProperties } from "react";
import { useState } from "react";

type MediaType = "image" | "document";

type MediaItem = {
  key: string;
  type: MediaType;
  image?: string;
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

function assetImageStyle(image: string): CSSProperties {
  return { "--news-image": `url(${image})` } as CSSProperties;
}

export default function MediaCenter({
  items,
  tabs,
  typeLabels,
  downloadLabel,
  emptyLabel,
}: MediaCenterProps) {
  const [activeTab, setActiveTab] = useState("all");

  const visibleItems = items.filter((item) => {
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
            <article className="newsroom-asset" key={item.key}>
              {item.type === "image" && item.image ? (
                <div
                  className="newsroom-asset__media"
                  style={assetImageStyle(item.image)}
                >
                  {/* TODO: Upload this asset to public/media/newsroom and keep the path in newsroomMediaItems. */}
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
                {/* TODO: Point this at the real asset URL once media is uploaded. */}
                <button className="newsroom-asset__action" type="button">
                  {downloadLabel}
                </button>
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
