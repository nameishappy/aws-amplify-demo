import { apiSignIn, apiSignOut, apiSignUp } from '@/services/AuthService'
import {
    setUser,
    signInSuccess,
    signOutSuccess,
    useAppSelector,
    useAppDispatch,
} from '@/store'
import appConfig from '@/configs/app.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useNavigate } from 'react-router-dom'
import useQuery from './useQuery'
import type { SignInCredential, SignUpCredential } from '@/@types/auth'
import { fetchAuthSession, signIn ,signOut, signUp} from 'aws-amplify/auth'

type Status = 'success' | 'failed'

function useAuth() {
    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const query = useQuery()

    const { token, signedIn } = useAppSelector((state) => state.auth.session)

    const signInAuth = async (
        values: SignInCredential
    ): Promise<
        | {
              status: Status
              message: string
          }
        | undefined
    > => {
        try {
            const { userName, password } = values
            const result = await signIn({
                username: userName,
                password: password,
            })
            console.log(result)
            const res=await fetchAuthSession()
            console.log(res)
            
            // const resp = await apiSignIn(values)
            if (result.isSignedIn) {
                const token = res.tokens?.accessToken.toString()
                if(!token){
                    return {
                        status: 'failed',
                        message: 'Token not found',
                    }
                }
                dispatch(signInSuccess(token))
                // if (resp.data.user) {
                //     dispatch(
                //         setUser(
                //             resp.data.user || {
                //                 avatar: '',
                //                 userName: 'Anonymous',
                //                 authority: ['USER'],
                //                 email: '',
                //             }
                //         )
                //     )
                // }
                const redirectUrl = query.get(REDIRECT_URL_KEY)
                navigate(
                    redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath
                )
                return {
                    status: 'success',
                    message: '',
                }
            }
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const signUpAuth = async (values: SignUpCredential) => {
        try {
            const { userName, password, name } = values
            const res = await signUp({
                username: userName,
                password: password,
                options: {
                    userAttributes: {
                        email: userName,
                        name: name,
                        // emailverified:"true"
                    },
                },
            })
            console.log(res)
            const resp = await apiSignUp(values)
            if (resp.data) {
                const { token } = resp.data
                dispatch(signInSuccess(token))
                if (resp.data.user) {
                    dispatch(
                        setUser(
                            resp.data.user || {
                                avatar: '',
                                userName: 'Anonymous',
                                authority: ['USER'],
                                email: '',
                            }
                        )
                    )
                }
                const redirectUrl = query.get(REDIRECT_URL_KEY)
                navigate(
                    redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath
                )
                return {
                    status: 'success',
                    message: '',
                }
            }
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const handleSignOut =async  () => {
        dispatch(signOutSuccess())
        const res=await signOut();
        console.log(res)
        dispatch(
            setUser({
                avatar: '',
                userName: '',
                email: '',
                authority: [],
            })
        )
        navigate(appConfig.unAuthenticatedEntryPath)
    }

    const signOutAuth = async () => {
        await apiSignOut()
        handleSignOut()
    }

    return {
        authenticated: token && signedIn,
        signInAuth,
        signUpAuth,
        signOutAuth,
    }
}

export default useAuth
