export default function extractSubdomains(url: string): string[] {
    try {
        console.log("input url =>> ", url);
      // Create a URL object
      const urlObj = new URL(url);
  
      // Get the hostname from the URL object
      const hostname = urlObj.hostname;
      console.log("input url =>> ", hostname);
  
      // Split the hostname into parts
      const parts = hostname.split('.');
      console.log("input hostname =>> ", parts);
  
      // If there are fewer than 3 parts, there are no subdomains
    //   if (parts.length < 3) {
    //     return [];
    //   }
  
      // Remove the top-level domain (TLD) and second-level domain (SLD)
    //   parts.pop(); // Remove the TLD
    //   parts.pop(); // Remove the SLD
    //   console.log("parts ==> ", parts);
      // Return the remaining parts as subdomains
      return parts;
    } catch (e) {
      // If the URL is invalid, return an empty array
      console.error(e);
      return [];
    }
  }
  