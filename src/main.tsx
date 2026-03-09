import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import {BrowserRouter} from "react-router";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {fetchPopularData} from "./api/moviesandseries/fetchPopularData.tsx";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
        }
    }
})

// Prefetch before the app even renders
queryClient.prefetchQuery({ queryKey: ['popularData'], queryFn: fetchPopularData })
createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
      </BrowserRouter>

  </StrictMode>,
)
