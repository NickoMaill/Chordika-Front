import Check from '@mui/icons-material/Check';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import Warning from '@mui/icons-material/Warning';
import { Regular } from './Text';
import { JSX } from 'react';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { StepIconProps } from '@mui/material/StepIcon';

const QontoConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 10,
        left: 'calc(-47% + 16px)',
        // right: 'calc(50% + 16px)',
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: theme.palette.primary.main,
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: theme.palette.success.main,
        },
    },
    [`&.${stepConnectorClasses}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: theme.palette.success.main,
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
        borderTopWidth: 5,
        borderRadius: 1,
        width: '97%',
    },
}));

const QontoStepIconRoot = styled('div')<{ ownerState: { active?: boolean } }>(({ theme, ownerState }) => ({
    color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
    ...(ownerState.active && {
        color: theme.palette.primary.main,
    }),
    '& .QontoStepIcon-active': {
        backgroundColor: theme.palette.primary.main,
        color: '#ffffff',
        borderRadius: 100,
        fontSize: 20,
        width: 30,
        height: 30,
        textAlign: 'center',
    },
    '& .QontoStepIcon-completedIcon': {
        color: '#ffffff',
        zIndex: 1,
        fontSize: 30,
        backgroundColor: theme.palette.success.main,
        borderRadius: 100,
        padding: 6,
    },
    '& .QontoStepIcon-circle': {
        backgroundColor: theme.palette.grey[300],
        color: '#ffffff',
        borderRadius: 100,
        fontSize: 20,
        width: 30,
        height: 30,
        textAlign: 'center',
    },
    '& .QontoStepIcon-errorIcon': {
        color: theme.palette.error.main,
        zIndex: 1,
        fontSize: 32,
    },
}));

function QontoStepIcon(props: StepIconProps, animate: boolean = false): JSX.Element {
    const { active, completed, className, icon, error } = props;
    return (
        <QontoStepIconRoot ownerState={{ active }} className={className}>
            {error ? (
                <Warning className="QontoStepIcon-errorIcon" />
            ) : active ? (
                <div className={`QontoStepIcon-active ${animate ? 'active-step-animation' : null}`}>{icon}</div>
            ) : completed ? (
                <Check className="QontoStepIcon-completedIcon" />
            ) : (
                <div className="QontoStepIcon-circle">{icon}</div>
            )}
        </QontoStepIconRoot>
    );
}

// const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad', 'whs', 'xjhcvbschdkb'];

export default function AppStepper({ steps, animate, activeStep }: IAppStepper): JSX.Element {
    return (
        <Stack sx={{ width: '100%' }} spacing={4}>
            <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
                {steps.map((step, i) => (
                    <Step key={i}>
                        <StepLabel error={step.isError} componentsProps={{ label: { style: { fontWeight: 'bolder', fontSize: 15 } } }} StepIconComponent={(p) => QontoStepIcon(p, animate)}>
                            {step.label}
                        </StepLabel>
                        {step.subtitle && <Regular sx={{ textAlign: 'center', fontSize: 13 }}>{step.subtitle}</Regular>}
                    </Step>
                ))}
            </Stepper>
        </Stack>
    );
}

interface IAppStepper {
    steps: {
        label: string;
        subtitle?: string;
        sortOrder: number;
        isError?: boolean;
    }[];
    activeStep: number;
    animate?: boolean;
}
