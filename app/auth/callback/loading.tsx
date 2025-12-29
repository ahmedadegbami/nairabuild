export default function AuthCallbackLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-xl font-semibold">Signing you in...</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You will be redirected shortly.
        </p>
      </div>
    </div>
  );
}
