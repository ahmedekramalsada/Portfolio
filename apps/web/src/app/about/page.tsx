export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-8 text-4xl font-bold">About</h1>
      <div className="prose prose-gray dark:prose-invert">
        <p className="text-lg text-muted-foreground">
          DevOps Engineer at SmartSigma, based in Cairo, Egypt. Building and maintaining
          production infrastructure across 7 VPS servers with 10+ applications serving
          thousands of users.
        </p>
        {/* Content coming soon */}
      </div>
    </div>
  );
}
