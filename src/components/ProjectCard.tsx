"use client";

import Image from "next/image";
import Link from "next/link";
import { type Project, categoryColors } from "@/data/projects";
import { useLanguage } from "./LanguageProvider";
import Tilt3D from "./Tilt3D";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { t } = useLanguage();
  const description = t.projects.descriptions[project.slug] || project.description;
  const categoryLabel = t.categories[project.category] || project.category;

  return (
    <Tilt3D intensity={6} className="h-full rounded-2xl">
      <Link href={`/projects/${project.slug}`} className="block h-full">
        <article className="group rounded-2xl border border-card-border bg-card overflow-hidden
          hover:shadow-xl hover:shadow-accent/10 hover:border-accent/40
          transition-all duration-300 flex flex-col h-full cursor-pointer">
          {/* Thumbnail */}
          <div className="relative aspect-video overflow-hidden bg-card-border">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {/* Hover overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent
              opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Category badge floating on image */}
            <span
              className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full
                backdrop-blur-md shadow-sm ${categoryColors[project.category]}`}
            >
              {categoryLabel}
            </span>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-6 flex flex-col flex-1">
            {/* Title */}
            <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-accent transition-colors duration-300">
              {project.title}
            </h3>

            {/* Description */}
            <p className="text-muted text-sm sm:text-base mb-5 flex-1 leading-relaxed">
              {description}
            </p>

            {/* View details indicator */}
            <div className="flex items-center gap-2 text-sm font-semibold text-accent opacity-0 group-hover:opacity-100
              translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              {t.projects.viewDetails}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </div>
        </article>
      </Link>
    </Tilt3D>
  );
}
