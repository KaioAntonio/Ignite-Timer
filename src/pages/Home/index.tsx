import { Play } from "phosphor-react";
import { CountdownContainer, 
    FormContainer, 
    HomeContainer, 
    MinutesAmountInput, 
    Separator, 
    StartCountdownButton, 
    TaskInput } from "./styles";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useEffect, useState } from "react";
import { differenceInSeconds } from 'date-fns';

// Controlled -> Mantem em tempo real o usuário dentro do estado | 
// Beneficio: Facilmente ter acesso aos valores, facilmente refletir valores nas interfaces

// Uncontrolled -> Busca a informação somente quando precissar | Ganho em performance

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod.number().min(5, 'O ciclo precisa ser de no mínimo 60 minutos')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
    id: string
    task: string
    minutesAmount: number
    startDate: Date
}

export function Home() {

    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [amountSecondsPassed, setAmmountSecondsPassed] = useState(0)

    const {register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0
        }
    });

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

    useEffect(() => {
        if (activeCycle) {
            setInterval(() => {
                setAmmountSecondsPassed(differenceInSeconds(new Date(), 
                activeCycle.startDate))
            }, 1000)
        }
    }, [activeCycle]);

    function handleCreateNewCycle(data: NewCycleFormData) {
        const newCycle: Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }

        setCycles((state) => [...cycles, newCycle])
        setActiveCycleId(newCycle.id)
        reset();
    }
      
    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;
    const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;
    const minutesAmount = Math.floor(currentSeconds / 60) 
    const secondsAmount = currentSeconds % 60

    const minutes = String(minutesAmount).padStart(2, '0')
    const seconds = String(secondsAmount).padStart(2, '0')

    console.log(activeCycle)
    const task = watch('task')
    const isSubmitDisabled = !task;

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">    
            <FormContainer>
                <div>
                    <label htmlFor="">Vou trabalhar em</label>
                    <TaskInput 
                        id="task" 
                        placeholder="Dê um nome para o seu projeto" 
                        list="task-suggestions"     
                        {...register('task')}
                    />

                    <datalist id="task-suggestions">
                        <option value="Projeto 1"></option>
                        <option value="Projeto 2"></option>
                        <option value="Projeto 3"></option>
                        <option value="Projeto 4"></option>
                    </datalist>
                    <label htmlFor="">durante</label>
                    <MinutesAmountInput 
                        type="number" 
                        id="minutesAmount"
                        placeholder="00"
                        step={5}
                        min={5}
                        max={60}
                        {...register('minutesAmount', {valueAsNumber: true})}
                        />

                    <span>minutos.</span>
                </div>
            </FormContainer>

            <CountdownContainer>
                <span>{minutes[0]}</span>
                <span>{minutes[1]}</span>
                <Separator>:</Separator>
                <span>{seconds[0]}</span>
                <span>{seconds[1]}</span>
            </CountdownContainer>

            <StartCountdownButton disabled={isSubmitDisabled} type="submit">
                <Play />
                Começar</StartCountdownButton>
    
            </form>
        </HomeContainer>
    )
}