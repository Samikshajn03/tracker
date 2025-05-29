
import '../app/globals.css';

export const metadata = {
  title: 'My App',
  description: 'My awesome app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
