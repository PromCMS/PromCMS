import { Button, Code, Paper, Title } from '@mantine/core';
// import NotFoundPage from '@pages/404';
import { AxiosError } from 'axios';
import { Component, PropsWithChildren } from 'react';

class ErrorBoundary extends Component<
  PropsWithChildren,
  { hasError: boolean; errorInfo?: Error }
> {
  constructor(props) {
    super(props);

    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    this.setState({
      errorInfo: error,
    });

    console.log({ error, errorInfo });
  }

  render() {
    if (
      this.state.errorInfo instanceof AxiosError &&
      this.state.errorInfo.response?.status === 404
    ) {
      // return <NotFoundPage />;
    }

    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen">
          <div className="m-auto text-center">
            <Title order={1} mb="lg" className="text-red-500">
              Oops, there is an error!
            </Title>
            <Paper
              withBorder
              shadow="xl"
              mb="lg"
              p="md"
              className="max-w-[1000px]"
            >
              <Code>{this.state.errorInfo?.stack}</Code>
            </Paper>
            <Button
              type="button"
              onClick={() => this.setState({ hasError: false })}
            >
              Try again?
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
