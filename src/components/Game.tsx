import {Button, TextField} from "@mui/material";
import {useEffect, useState} from "react";
import "./style.css"
import {useParams} from "react-router-dom";

function isValidURL(str: string): boolean {
    try {
        new URL(str);
        return true;
    } catch (_) {
        return false;
    }
}
export interface ICocktail {
    id: number,
    attempts: number,
    drinkHints: string[],
    hiddenName: string,
    score: number,
    highestScore: number,
    strInstructions: string
}


const playGame = async (userValue: string, gameRoomId: number, apiUrl: string) => {
    try {
        const response = await fetch(`${apiUrl}/api/cocktail/play/${gameRoomId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userWord: userValue
            }),
        });

        const data = await response.json(); // Parse the response as JSON
        return data as ICocktail

    } catch (_) {
        return {} as ICocktail
    }
};

export default function Game(){
    const apiUrl = import.meta.env.VITE_API_URL;

    const { id } = useParams();

    const [cocktail, setCocktail] = useState({drinkHints: [""]} as ICocktail);
    const [userValue, setUserValue] = useState('');


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserValue(event.target.value);
    };

    const handleSubmit = () => {
        if(userValue.length > 0 && id !== undefined){
            playGame(userValue, parseInt(id), apiUrl).then(data => {
                if (Object.keys(data).length !== 0){
                    setCocktail(data)
                    setUserValue('');
                }
            })
        }
    };


    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSubmit()
        }

    };


    useEffect(() => {
        fetch(`${apiUrl}/api/cocktail/game/${id}`)
            .then((res) => res.json())
            .then((data: ICocktail) => {
                // console.log(data)
                setCocktail(data);
            })
    }, [id])

    useEffect(() => {
        console.log();
    }, []);



    return (
        <div className="home">
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <h3>Current Score: {cocktail.score}</h3>
                <h3>Attempts left: {cocktail.attempts}</h3>

                <h3>Highest score: {cocktail.highestScore}</h3>
            </div>
            <div style={{
                paddingBottom: "2rem",
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {cocktail.drinkHints.filter((hints) => isValidURL(hints))[0] ? (
                    <img src={cocktail.drinkHints.filter((hints) => isValidURL(hints))[0]} alt="img" height="200px" width="200px"/>
                ) :(
                    <></>
                )}

                <h1>{cocktail.hiddenName}</h1>
                <h2>Here is the instructions to make this cocktail: </h2>
                <h3 style={{maxWidth: "550px"}}>{cocktail.strInstructions}</h3>
            </div>


            <div style={{display: 'flex', justifyContent: 'center', gap: "3rem"}}>
                <TextField
                    id="standard-search"
                    label="Search field"
                    type="search"
                    variant="standard"
                    value={userValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    style={{maxWidth: '100% !important'}}
                />

                <Button variant="contained" color="success" onClick={handleSubmit}>
                    Sent
                </Button>
            </div>

            <div style={{
                paddingBottom: "2rem",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center"
            }}>
                <h2>Here are some hints to help you guess the name of the cocktail:</h2>
                <ol>
                    {cocktail.drinkHints
                        .filter((hint) => !isValidURL(hint))
                        .map((hint, index) => (
                            <li key={index}>
                                <h3>{hint}</h3>
                            </li>
                        ))}

                </ol>
            </div>


        </div>
    )
}
