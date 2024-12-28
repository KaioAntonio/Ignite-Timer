import { Play } from "phosphor-react";
import { CountdownContainer, 
    FormContainer, 
    HomeContainer, 
    MinutesAmountInput, 
    Separetor, 
    StartCountdownButton, 
    TaskInput } from "./styles";

export function Home() {
    return (
        <HomeContainer>
            <form action="">    
            <FormContainer>
                <div>
                    <label htmlFor="">Vou trabalhar em</label>
                    <TaskInput 
                        id="task" 
                        placeholder="Dê um nome para o seu projeto" />

                    <label htmlFor="">durante</label>
                    <MinutesAmountInput 
                        type="number" 
                        id="minutesAmount"
                        placeholder="00" />

                    <span>minutos.</span>
                </div>
            </FormContainer>

            <CountdownContainer>
                <span>0</span>
                <span>0</span>
                <Separetor>:</Separetor>
                <span>0</span>
                <span>0</span>
            </CountdownContainer>

            <StartCountdownButton type="submit">
                <Play />
                Começar</StartCountdownButton>
    
            </form>
        </HomeContainer>
    )
}