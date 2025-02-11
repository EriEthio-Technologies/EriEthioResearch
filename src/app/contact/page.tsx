import { Map } from "./components/Map"
import { Form } from "./components/Form"

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Location</h2>
          <Map />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <Form />
        </div>
      </div>
    </div>
  )
}

