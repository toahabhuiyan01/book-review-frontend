import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { UserLoginRegisterType } from '../types';
import useAuthStore from '../store/AuthStore';
import { CircularProgress } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import useAlertStore from '../store/AlertStore';
import { AxiosError } from 'axios';

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '450px',
    },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
        ...theme.applyStyles('dark', {
        boxShadow:
        'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
    minHeight: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage:
        'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat',
        ...theme.applyStyles('dark', {
        backgroundImage:
            'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
    },
}));

export default function SignIn({ page }: { page: 'login' | 'register' }) {
    const { login, register } = useAuthStore()
    const { setAlert } = useAlertStore()
    const navigate = useNavigate()
    
    const loginRegForm = useFormik<UserLoginRegisterType>({
        initialValues: {
            email: '',
            username: page === 'register' ? '' : 'default value', // this is to ignore the validation error
            password: ''
        },
        onSubmit: async (values) => {
            try {
                if (page === 'login') {
                    await login(values.email, values.password)
                    navigate('/profile')
                } else {
                    await register(values.email, values.username, values.password)
                    navigate('/auth/login')
                }
            } catch(error) {
                if(error instanceof AxiosError) {
                    setAlert(error.response!.data.message, 'error')
                } else {
                    setAlert('An error occurred', 'error')
                }
            }
        },
        validationSchema: Yup.object({
            email: Yup.string().trim().email('Please Enter a valid Email').required('Fill in the email'),
            username: page === 'register' ? Yup.string().trim().required('Fill in the username').min(3, 'Username must be at least 3 characters') : Yup.string().trim().required(),
            password: page === 'register' ? Yup.string().trim().required('Fill in the password').min(8, 'Password must be at least 8 characters') : Yup.string().trim().required()
        })
    })

    const emailError = !!loginRegForm.errors.email && loginRegForm.touched.email
    const usernameError = !!loginRegForm.errors.username && loginRegForm.touched.username
    const passwordError = !!loginRegForm.errors.password && loginRegForm.touched.password

    return (
        <SignInContainer>
            <Card variant="outlined">
                <Typography
                    component="h1"
                    variant="h4"
                    sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                >
                    { page === 'login' ? 'Sign in' : 'Sign up' }
                </Typography>
                <Box
                    component="form"
                    onSubmit={loginRegForm.handleSubmit}
                    noValidate
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        gap: 2,
                    }}
                >
                    {
                        page === 'register' && (
                            <FormControl>
                                <FormLabel htmlFor="username">Username</FormLabel>
                                <TextField
                                    error={usernameError}
                                    helperText={loginRegForm.touched.username && loginRegForm.errors.username}
                                    size='small'
                                    id="username"
                                    type="text"
                                    name="username"
                                    placeholder="Enter your username"
                                    autoFocus
                                    fullWidth
                                    variant="outlined"
                                    color={usernameError ? 'error' : 'primary'}
                                    onChange={loginRegForm.handleChange}
                                    onBlur={loginRegForm.handleBlur}
                                />
                            </FormControl>
                        )
                    }
                    <FormControl>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <TextField
                            error={emailError}
                            helperText={loginRegForm.touched.email && loginRegForm.errors.email}
                            size='small'
                            id="email"
                            type="email"
                            name="email"
                            placeholder="your@email.com"
                            autoComplete="email"
                            fullWidth
                            variant="outlined"
                            onChange={loginRegForm.handleChange}
                            onBlur={loginRegForm.handleBlur}
                            color={emailError ? 'error' : 'primary'}
                            sx={{ ariaLabel: 'email' }}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <TextField
                            error={passwordError}
                            helperText={ loginRegForm.touched.password && loginRegForm.errors.password}
                            size='small' 
                            name="password"
                            placeholder="••••••"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            fullWidth
                            variant="outlined"
                            onChange={loginRegForm.handleChange}
                            onBlur={loginRegForm.handleBlur}
                            color={passwordError ? 'error' : 'primary'}
                        />
                    </FormControl>
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        disabled={!loginRegForm.isValid || loginRegForm.isSubmitting}
                        startIcon={loginRegForm.isSubmitting ? <CircularProgress size={16} /> : null}
                        onClick={() => loginRegForm.handleSubmit()}
                    >
                        { page === 'login' ? 'Sign in' : 'Sign up' }
                    </Button>
                    <Typography sx={{ textAlign: 'center' }}>
                        { page === 'login' ? 'Don\'t have an account? ' : 'Already have an account? ' }
                        <Link
                            style={{ color: 'blue'}}
                            to={ page === 'login' ? '/auth/register' : '/auth/login' }
                        >
                            { page === 'login' ? 'Sign up' : 'Sign in' }
                        </Link>
                    </Typography>
                </Box>
            </Card>
        </SignInContainer>
    )
}