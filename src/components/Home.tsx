import {Box, Button, CircularProgress} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {green} from '@mui/material/colors';
import {ICocktail} from "./Game.tsx";

export default function Home(){
    const apiUrl = import.meta.env.VITE_API_URL;

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [cocktails, setCocktails] = useState([] as ICocktail[]);


    const getAllCocktails = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/cocktail/all`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },

            });

            return await response.json()


        } catch (_) {
            setCocktails([]);
        }
    }


    useEffect( () => {
        getAllCocktails().then((data) => {
            setCocktails(data);
        })
    }, []);


    const buttonSx = {
        ...(success && {
            bgcolor: green[500],
            '&:hover': {
                bgcolor: green[700],
            },
        }),
    };

    const startNewGame = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${apiUrl}/api/cocktail/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

            });

            const data = await response.json();
            setLoading(false)
            setSuccess(true)


            return navigate(`game/${data.id}`, {state: data});

        } catch (_) {
            setSuccess(false)
            return navigate("/");
        }
    }

    const navigateToGame = (gameId: number) => {
        return navigate(`/game/${gameId}`)
    }



    return (
        <div style={{minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column"}}>
            <Box sx={{ m: 1, position: 'relative' }}>
                <Button
                    variant="contained"
                    sx={buttonSx}
                    disabled={loading}
                    onClick={startNewGame}
                >
                    Click the button to start the new cocktail game!
                </Button>
                {loading && (
                    <CircularProgress
                        size={24}
                        sx={{
                            color: green[500],
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            marginTop: '-12px',
                            marginLeft: '-12px',
                        }}
                    />
                )}
            </Box>

            <ul style={{listStyleType: "none"}}>
                {cocktails.map((cocktail, index) => (
                    <li key={index}>
                        <a href={`/game/${cocktail.id}`}>Enter on the existing game: {cocktail.id}</a>
                    </li>
                ))}
            </ul>


        </div>
    )
}
