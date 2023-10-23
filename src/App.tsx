import React, { useMemo } from 'react'

//import { GoogleAuthProvider, EmailAuthProvider } from 'firebase/auth'
import { EmailAuthProvider } from 'firebase/auth'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { BrowserRouter as Router } from 'react-router-dom'

import 'typeface-rubik'
import '@fontsource/ibm-plex-mono'

import {
  //buildCollection,
  CircularProgressCenter,
  createCMSDefaultTheme,
  FirebaseAuthController,
  FirebaseLoginView,
  FireCMS,
  NavigationRoutes,
  Scaffold,
  SideDialogs,
  useFirebaseAuthController,
  useBuildModeController,
  useFirebaseStorageSource,
  useFirestoreDataSource,
  useInitialiseFirebase,
  useValidateAuthenticator
} from '@camberi/firecms'

import firebaseConfig from './config/firebase'
import * as Model from './model'
import appConfig from './config/appConfig.js'

const DEFAULT_SIGN_IN_OPTIONS = [
  //GoogleAuthProvider.PROVIDER_ID,
  EmailAuthProvider.PROVIDER_ID
]

const App = () => {
  const signInOptions = DEFAULT_SIGN_IN_OPTIONS

  const {
    firebaseApp,
    firebaseConfigLoading,
    configError,
    firebaseConfigError
  } = useInitialiseFirebase({ firebaseConfig })

  const authController: FirebaseAuthController = useFirebaseAuthController({
    firebaseApp,
    signInOptions
  })

  const dataSource = useFirestoreDataSource({
    firebaseApp
  })

  const storageSource = useFirebaseStorageSource({ firebaseApp: firebaseApp })

  const modeController = useBuildModeController()
  const theme = useMemo(
    () => createCMSDefaultTheme({ mode: modeController.mode }),
    []
  )

  const {
    //authLoading,
    canAccessMainView
    //notAllowedError
  } = useValidateAuthenticator({
    authController,
    authentication: ({ user }) => {
      console.log('Allowing access to', user?.email)
      return true
    },
    dataSource,
    storageSource
  })

  if (configError) {
    return <div> {configError} </div>
  }

  if (firebaseConfigError) {
    return (
      <div>
        It seems like the provided Firebase config is not correct. If you are
        using the credentials provided automatically by Firebase Hosting, make
        sure you link your Firebase app to Firebase Hosting.
      </div>
    )
  }

  if (firebaseConfigLoading || !firebaseApp) {
    return <CircularProgressCenter />
  }

  return (
    <Router>
      <FireCMS
        authController={authController}
        collections={Object.values(Model)}
        modeController={modeController}
        dataSource={dataSource}
        storageSource={storageSource}
        entityLinkBuilder={({ entity }) =>
          `https://console.firebase.google.com/project/${firebaseApp.options.projectId}/firestore/data/${entity.path}/${entity.id}`
        }
      >
        {({ context, loading }) => {
          let component
          if (loading) {
            component = <CircularProgressCenter />
          } else if (!canAccessMainView) {
            component = (
              <FirebaseLoginView
                logo={appConfig.logo}
                disableSignupScreen={true}
                allowSkipLogin={false}
                signInOptions={signInOptions}
                firebaseApp={firebaseApp}
                authController={authController}
              />
            )
          } else {
            component = (
              <Scaffold name={appConfig.appTitle} logo={appConfig.logoTop}>
                <NavigationRoutes />
                <SideDialogs />
              </Scaffold>
            )
          }

          return (
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {component}
            </ThemeProvider>
          )
        }}
      </FireCMS>
    </Router>
  )
}

export default App
