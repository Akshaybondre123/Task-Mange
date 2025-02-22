import { BoardContainer } from "@/components/board-container"
import { Header } from "@/components/header"
import { MainContent } from "@/components/main-content"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <BoardContainer />
</main>
)
}