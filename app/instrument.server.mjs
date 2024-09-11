import * as Sentry from "@sentry/remix";

Sentry.init({
    dsn: process.env.VITE_ENV_SENTRY_DSN,
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for tracing.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,

    // To use Sentry OpenTelemetry auto-instrumentation
    // default: false
    autoInstrumentRemix: true,

    // Optionally capture action formData attributes with errors.
    // This requires `sendDefaultPii` set to true as well.
    captureActionFormDataKeys: {
        key_x: true,
        key_y: true,
    },
    // To capture action formData attributes.
    sendDefaultPii: true
});
