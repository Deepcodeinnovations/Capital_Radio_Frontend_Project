export default [
  {
    path: '/auth',
    component: () => import('../../views/auth/main.vue'),
    meta: {
      title: 'Authentication',
      description: 'Capital Radio Admin Portal - Secure access to manage your radio stations',
      keywords: 'capital radio, admin, login, authentication, uganda radio',
      requiresGuest: true
    },
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('../../views/auth/Login.vue'),
        meta: {
          title: 'Sign In',
          description: 'Sign in to Capital Radio Admin Portal to manage your radio stations and content',
          keywords: 'capital radio, login, sign in, admin portal, authentication',
          ogTitle: 'Capital Radio - Admin Sign In',
          ogDescription: 'Access your Capital Radio admin dashboard to manage stations, content, and users',
          ogImage: '/images/capital-radio-admin-og.jpg',
          twitterTitle: 'Capital Radio Admin Portal',
          twitterDescription: 'Sign in to manage your Capital Radio stations',
          twitterImage: '/images/capital-radio-admin-twitter.jpg'
        }
      },
      {
        path: 'reset-password',
        name: 'ResetPassword',
        component: () => import('../../views/auth/ResetPassword.vue'),
        meta: {
          title: 'Reset Password',
          description: 'Reset your Capital Radio admin account password securely',
          keywords: 'capital radio, reset password, forgot password, admin account',
          ogTitle: 'Capital Radio - Reset Password',
          ogDescription: 'Securely reset your Capital Radio admin account password',
          canonical: false
        }
      },
      {
        path: 'verify-otp',
        name: 'VerifyOTP',
        component: () => import('../../views/auth/VerifyOTP.vue'),
        meta: {
          title: 'Verify Code',
          description: 'Enter the verification code sent to your email to continue password reset',
          keywords: 'capital radio, otp, verification, security code',
          ogTitle: 'Capital Radio - Verify Code',
          ogDescription: 'Complete your password reset by entering the verification code',
          canonical: false
        }
      },
      {
        path: 'new-password',
        name: 'NewPassword',
        component: () => import('../../views/auth/NewPassword.vue'),
        meta: {
          title: 'Create New Password',
          description: 'Create a new secure password for your Capital Radio admin account',
          keywords: 'capital radio, new password, update password, security',
          ogTitle: 'Capital Radio - New Password',
          ogDescription: 'Set up a new secure password for your admin account',
          canonical: false
        }
      }
    ] 
  }
 ]