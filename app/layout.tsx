import AuthClientWrapper from './AuthClientWrapper';
import './globals.css';

export const metadata = {
  title: 'Rewards Dashboard',
  description: 'Role-based dashboard application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthClientWrappe>
          {children}
        </AuthClientWrappe>
      </body>
    </html>
  );
}
