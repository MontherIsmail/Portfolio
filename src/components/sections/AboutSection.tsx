export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-background-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              About Me
            </h2>
            <div className="h-1 w-24 bg-primary-400 mx-auto rounded-full"></div>
          </div>
          <div className="bg-background-secondary rounded-2xl p-8 border border-border-primary">
            <p className="text-lg text-text-secondary leading-relaxed">
              Coming soon... This section will contain personal bio, education,
              and achievements.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
