'use client';
import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/ContantMe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Message sent successfully!');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        alert('Failed to send message.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center ml-5 mr-5 xl:ml-72 xl:mr-72 h-screen ">
      <h1 className="text-white text-6xl">Contact Me</h1>
      <p className="text-white text-[13px] mt-12 font-extralight">
        Feel free to get in touch! You can use the contact information below for any questions, suggestions, or collaboration opportunities.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full gap-4 mt-12 justify-items-center items-center">
        <div>
          <p className="text-white text-[14px] font-extralight tracking-3 w-25">Telefon</p>
          <p className="text-white text-[13px] font-extralight w-25">---</p>
        </div>
        <div>
          <p className="text-white text-[14px] font-extralight tracking-3 w-25">Address</p>
          <p className="text-white text-[13px] font-extralight w-25">Sivas/Merkez</p>
        </div>
        <div>
          <p className="text-white text-[14px] font-extralight tracking-3 w-25">Email</p>
          <a href="mailto:sglk.brk@gmail.com" className="text-white text-[13px] font-extralight w-25">
            sglk.brk@gmail.com
          </a>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-12 w-full mt-12">
        <div className="flex flex-col justify-center items-center space-y-4 w-full col-span-12 sm:col-span-7">
          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-3 bg-black border border-gray-500 placeholder:text-gray placeholder:font-extralight placeholder:text-[14px]  placeholder:uppercase text-white"
            placeholder="Name"
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full p-3 bg-black border border-gray-500 placeholder:text-gray placeholder:font-extralight placeholder:text-[14px] placeholder:uppercase text-white"
            placeholder="Email"
          />
          <input
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className="w-full p-3 bg-black border border-gray-500 placeholder:text-gray placeholder:font-extralight placeholder:text-[14px] placeholder:uppercase text-white"
            placeholder="Subject"
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={5}
            className="w-full p-3 bg-black border border-gray-500 placeholder:text-gray placeholder:font-extralight placeholder:text-[14px] placeholder:uppercase text-white"
            placeholder="Message"
          />
          <div className="w-full">
            <button type="submit" className="text-black text-[14px] bg-white uppercase border border-white p-2 tracking-3 rounded-sm">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
