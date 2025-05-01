import { Typography, Input, Textarea, Button } from "@material-tailwind/react";

export default function ContactUs() {
  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8 md:p-12">
        <Typography variant="h2" className="mb-6 text-center text-blue-gray-900 font-semibold">
          Contact Us
        </Typography>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Full Name" size="lg" className="bg-white" />
            <Input label="Email Address" type="email" size="lg" className="bg-white" />
          </div>
          <Textarea
            label="Your Message"
            rows={6}
            className="bg-white"
          />
          <Button type="submit" size="xxlg" className="bg-blue-600" fullWidth>
            Send Message
          </Button>
        </form>
      </div>
    </section>
  );
}
