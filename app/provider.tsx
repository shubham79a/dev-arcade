"use client"

import React, { useEffect } from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { useUser } from '@clerk/nextjs'
import axios from 'axios'

function Provider({
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {

    const { user } = useUser();

    const CreateNewUser = async () => {
        const result = await axios.post('/api/user', {});
        console.log(result);
    }

    useEffect(() => {
        user && CreateNewUser();
    }, [user])

    return (
        <NextThemesProvider {...props}>
            {children}
        </NextThemesProvider>
    )
}

export default Provider