"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// Dummy data for demonstration - impactScore is now deterministic
const allProjects = Array.from({ length: 25 }, (_, i) => ({
  id: `proj-${i + 1}`,
  title: `Solar Panel Installation Project ${i + 1}`,
  description: `This project aims to install solar panels in ${i + 1} schools, saving approximately ${
    10 + i
  } tons of CO₂ per year.`,
  // Deterministic score: (7.0 + (i % 20) * 0.1) to keep it within a reasonable range
  impactScore: (7.0 + (i % 20) * 0.1).toFixed(1),
}))

const ITEMS_PER_PAGE = 5

export function ProjectsList() {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(allProjects.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentProjects = allProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-transparent px-4">
      <div className="container space-y-12">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">Featured Climate Projects</h2>
            <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Explore some of the impactful projects funded by our DAO.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-1 lg:grid-cols-2 lg:gap-12">
          {currentProjects.map((project) => (
            <Card
              key={project.id}
              className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300 bg-black/50 border border-gray-800"
            >
              <CardHeader>
                <CardTitle className="text-xl font-semibold mb-2 text-white">{project.title}</CardTitle>
                <CardDescription className="text-gray-300">
                  Environmental Impact Score: <span className="font-bold text-teal-600">{project.impactScore}/10</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="text-gray-300">{project.description}</CardContent>
            </Card>
          ))}
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChange(currentPage - 1)
                }}
                aria-disabled={currentPage === 1}
                tabIndex={currentPage === 1 ? -1 : undefined}
                className="text-gray-300 hover:bg-gray-800"
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === i + 1}
                  onClick={(e) => {
                    e.preventDefault()
                    handlePageChange(i + 1)
                  }}
                  className="text-gray-300 hover:bg-gray-800 data-[active=true]:bg-teal-600 data-[active=true]:text-white data-[active=true]:hover:bg-teal-700"
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChange(currentPage + 1)
                }}
                aria-disabled={currentPage === totalPages}
                tabIndex={currentPage === totalPages ? -1 : undefined}
                className="text-gray-300 hover:bg-gray-800"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </section>
  )
}
