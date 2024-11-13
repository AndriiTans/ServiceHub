// @ts-nocheck

import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

class ParserController {
  async parseHTML(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
      }

      const filePath = req.file.path;
      const readStream = fs.createReadStream(filePath, { encoding: 'utf-8' });

      let content = '';
      const CHECKED_KEY = 'linear_conversation';
      let iterationCheckedKey = 0;
      let finished = false;
      let openSymbols = 0;

      let savingStarted = false;
      let savingFinished = false;

      // Define the path to the uploads directory in the root of the project
      const uploadsDir = path.join(process.cwd(), 'uploads');

      // Ensure that the uploads directory exists
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Create a write stream to save the processed content in the uploads directory
      const outputFileName = `${req.file.filename}.json`;
      const outputFilePath = path.join(uploadsDir, outputFileName);
      const writeStream = fs.createWriteStream(outputFilePath);

      // Read the file in chunks
      readStream.on('data', (chunk) => {
        let i = 0;

        while (i < chunk.length) {
          if (!finished) {
            if (CHECKED_KEY[iterationCheckedKey] === chunk[i]) {
              iterationCheckedKey++;
            } else {
              iterationCheckedKey = 0;
            }
          }

          if (iterationCheckedKey === CHECKED_KEY.length) {
            finished = true;
          }

          if (finished && !savingFinished) {
            if (chunk[i] === '[' || chunk[i] === '{') {
              savingStarted = true;
              openSymbols++;
            } else if (chunk[i] === ']' || chunk[i] === '}') {
              openSymbols--;
            }

            // Only add the content after the key is found and if openSymbols > 0
            if (savingStarted && !savingFinished) {
              content += chunk[i];
            }

            if (savingStarted && openSymbols <= 0) {
              savingFinished = true;
              break; // Exit the loop as we have completed saving the necessary content
            }
          }

          i++;
        }

        // Write the processed content chunk by chunk to the file
        writeStream.write(content);
        content = ''; // Clear content after writing to handle the next chunk correctly
      });

      readStream.on('end', () => {
        console.log('Processing complete. The content has been written to the file.');

        writeStream.end(); // Close the write stream

        // Now create a read stream to read the processed file
        const outputReadStream = fs.createReadStream(outputFilePath, { encoding: 'utf-8' });
        let jsonContent = '';

        outputReadStream.on('data', (chunk) => {
          jsonContent += chunk; // Collect chunks as they come in
        });

        outputReadStream.on('end', () => {
          try {
            const parsedContent = JSON.parse(jsonContent); // Parse the complete JSON content

            const filteredContent = parsedContent.filter((el) => {
              const role = el?.message?.author?.role;

              return role === 'user' || role === 'assistant';
            });

            const transformedContent = filteredContent.map((contentItem) => {
              return {
                author: contentItem?.message?.author,
                ...contentItem?.message?.content,
              };
            });

            res.status(200).json({
              message: 'File processed and saved successfully',
              filePath: outputFilePath,
              content: transformedContent,
            });
          } catch (parseErr) {
            console.error('Error parsing the saved file content:', parseErr);
            res
              .status(500)
              .json({ message: 'Error parsing the saved file content', error: parseErr });
          }
        });

        outputReadStream.on('error', (err) => {
          console.error('Error reading the saved file:', err);
          res.status(500).json({ message: 'Error reading the saved file', error: err });
        });
      });

      readStream.on('error', (err) => {
        console.error('Error reading file:', err);
        res.status(500).json({ message: 'Server error', error: err });
      });

      writeStream.on('error', (err) => {
        console.error('Error writing to the file:', err);
        res.status(500).json({ message: 'Error writing to file', error: err });
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }
}

export default new ParserController();
