import { GoogleLogin } from '@react-oauth/google';

function GoogleAuthButton({ onSuccess }) {
  return (
    <div className="flex justify-center">
      <div className="rounded-full bg-white px-1 py-1">
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            if (typeof onSuccess === 'function') {
              onSuccess(credentialResponse);
            } else {
              console.error('onSuccess prop is missing or not a function');
            }
          }}
          onError={() => {
            console.error('Google Login Failed');
          }}
          useOneTap={false}
          shape="pill"
          theme="outline"
          size="large"
        />
      </div>
    </div>
  );
}

export default GoogleAuthButton;
