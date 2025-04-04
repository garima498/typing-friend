Hi all,

Some of you may already have noticed: as of Canary 136.0.7103.0, all built-in APIs have new entry points. Rather than on self.ai.*, you'll now find the APIs directly on self.*. You instantiate them using the static create() method:

   await LanguageModel.create();
      await Summarizer.create();
          await Writer.create();
        await Rewriter.create();
await LanguageDetector.create();
      await Translator.create();

Likewise, there's now a static availability() method:

   await LanguageModel.availability();
      await Summarizer.availability();
          await Writer.availability();
        await Rewriter.availability();
await LanguageDetector.availability();
      await Translator.availability();
 
This API change was based on feedback from other vendors. Apologies for the inconveniences and for possibly breaking some of your demos and apps.

Cheers,
Tom