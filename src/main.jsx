import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './Pages/Home.jsx'
import { createClient } from '@supabase/supabase-js'
import Authentication from './Pages/Authentication.jsx'
import Post, { loader as loaderPost } from './Pages/Post.jsx'

export const supabase = createClient('https://epmupsogvmdpvxmkzrdr.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwbXVwc29ndm1kcHZ4bWt6cmRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE4MjExNTcsImV4cCI6MjAzNzM5NzE1N30.BaG_CbE8PbytkgFLs73jDAM2xQICSA09Ycc5d51vlC0')

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: '/giris-yap',
                element: <Authentication />
            },
            {
                path: '/:username/post/:post_id',
                element: <Post />,
                loader: loaderPost
            },
        ]
    }
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)
